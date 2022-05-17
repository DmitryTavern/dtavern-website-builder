import * as fs from 'fs'
import * as path from 'path'
import { error, log, warn } from './logger'

interface ComponentInjectOptions {
	category: string
	name: string
}

interface ComponentConfig {
	namespace: string
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

function getComponentDir(options: ComponentInjectOptions): string | undefined {
	const dir = path.join(APP_COMPONENTS_DIR, options.category, options.name)

	if (!fs.existsSync(dir)) {
		error(`component '${options.name}' not found`)
		return undefined
	}

	return dir
}

function getComponentConfig(
	options: ComponentInjectOptions
): ComponentConfig | undefined {
	const configPath = path.join(
		APP_COMPONENTS_DIR,
		options.category,
		options.name,
		`${options.name}.json`
	)

	if (!fs.existsSync(configPath)) {
		error(`component '${options.name}' have not config.json`)
		return undefined
	}

	return JSON.parse(
		fs.readFileSync(configPath, {
			encoding: 'utf-8',
		})
	)
}

function injectInGlobal(options: Options) {
	const contentFn = extentionContentFns[options.type]
	const globalFileRoute = extentionGlobalRoutes[options.type]
	const includePath = path.relative(globalFileRoute, options.componentFileRoute)

	if (!fs.existsSync(globalFileRoute)) {
		warn(
			`Injecting for component ${options.componentFileRoute} in global failed.`
		)
		return
	}

	let data = fs.readFileSync(globalFileRoute, { encoding: 'utf-8' })

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
		warn(
			`Injecting for component ${options.componentFileRoute} in ${options.namespace}.${options.type} failed.`
		)
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

	const componentDir = getComponentDir(options)
	const config = getComponentConfig(options)

	if (!(componentDir && config)) return

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
