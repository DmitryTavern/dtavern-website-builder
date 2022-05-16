import * as fs from 'fs'
import * as path from 'path'
import { error, log } from './logger'

interface ComponentInjectOptions {
	category: string
	name: string
}

interface Options {
	type: string
	namespace: string
	componentFileRoute: string
}

const {
	APP_PAGES_DIR,
	APP_PAGES_STYLES_DIR,
	APP_PAGES_SCRIPTS_DIR,
	APP_COMPONENTS_DIR,
	ARTISAN_COMPONENT_AUTOIMPORT,
	ARTISAN_COMPONENT_AUTOIMPORT_PUG_PATH,
	ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH,
	ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH,
} = process.env

const extentionGlobalRoutes = {
	pug: ARTISAN_COMPONENT_AUTOIMPORT_PUG_PATH,
	scss: ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH,
	js: ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH,
}

const extentionPageRoutes = {
	pug: APP_PAGES_DIR,
	scss: APP_PAGES_STYLES_DIR,
	js: APP_PAGES_SCRIPTS_DIR,
}

const extentionContentFns = {
	pug: (path: string) => `include ${path}\n`,
	scss: (path: string) => `@import '${path}';\n`,
	js: (path: string) => `require('${path}')\n`,
}

function injectInGlobal(options: Options) {
	const contentFn = extentionContentFns[options.type]
	const globalFileRoute = extentionGlobalRoutes[options.type]
	const includePath = path.relative(globalFileRoute, options.componentFileRoute)

	let data = ''

	if (fs.existsSync(globalFileRoute)) {
		data = fs.readFileSync(globalFileRoute, { encoding: 'utf-8' })
	}

	data += contentFn(includePath)

	fs.writeFileSync(globalFileRoute, data)
}

function injectInPage(options: Options) {
	const contentFn = extentionContentFns[options.type]
	const pageFileRoute = path.join(
		extentionPageRoutes[options.type],
		`${options.namespace}.${options.type}`
	)

	const includePath = path.relative(pageFileRoute, options.componentFileRoute)

	if (!fs.existsSync(pageFileRoute)) {
		console.log('Warn')
		return
	}

	const content = contentFn(includePath)
	let data = fs.readFileSync(pageFileRoute, {
		encoding: 'utf-8',
	})

	if (options.type === 'pug') {
		data = data.replace(/\n/, `\n${content}`)
	}

	if (options.type === 'scss' || options.type === 'js') {
		data = data.replace(/\/\/ @-auto-import\n/, `${content}// @-auto-import\n`)
	}

	fs.writeFileSync(pageFileRoute, data)
}

export function injectComponent(options: ComponentInjectOptions) {
	if (!ARTISAN_COMPONENT_AUTOIMPORT) return

	const componentDir = path.join(
		APP_COMPONENTS_DIR,
		options.category,
		options.name
	)

	const componentConfigFilePath = path.join(
		componentDir,
		`${options.name}.json`
	)

	if (!fs.existsSync(componentConfigFilePath))
		return error(`component '${options.name}' have not config.json`)

	const config = JSON.parse(
		fs.readFileSync(componentConfigFilePath, {
			encoding: 'utf-8',
		})
	)

	if (!config.namespace) return error('injector namespace is undefined')

	for (const type of ['pug', 'scss', 'js']) {
		const componentFileRoute = path.join(
			componentDir,
			`${options.name}.${type}`
		)

		if (!fs.existsSync(componentFileRoute)) continue

		const opts: Options = {
			namespace: config.namespace,
			componentFileRoute,
			type,
		}

		if (config.namespace === 'global') {
			injectInGlobal(opts)
			continue
		}

		if (config.namespace !== 'none') {
			injectInPage(opts)
			continue
		}
	}

	log('Component success injected')
}
