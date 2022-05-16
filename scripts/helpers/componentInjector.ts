import * as fs from 'fs'
import * as path from 'path'
import { error, log } from './logger'

type Extentions = 'pug' | 'scss' | 'js'
type Namespaces = 'global' | 'none' | string
type Types = Array<Extentions>

interface Options {
	type: string
	path: string
	namespace: string
}

const {
	APP_PAGES_DIR,
	APP_PAGES_STYLES_DIR,
	APP_PAGES_SCRIPTS_DIR,
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
	const componentFileRoute = options.path
	const includePath = path.relative(globalFileRoute, componentFileRoute)

	let data = ''

	if (fs.existsSync(globalFileRoute)) {
		data = fs.readFileSync(globalFileRoute, { encoding: 'utf-8' })
	}

	data += contentFn(includePath)

	fs.writeFileSync(globalFileRoute, data)
}

function injectInPage(options: Options) {
	const contentFn = extentionContentFns[options.type]
	const componentFileRoute = options.path
	const pageFileRoute = path.join(
		extentionPageRoutes[options.type],
		`${options.namespace}.${options.type}`
	)

	const includePath = path.relative(pageFileRoute, componentFileRoute)

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

export function componentInjector() {
	let filePath: string | undefined
	let namespace: Namespaces | undefined
	let types: Types = []

	const actions = {
		setNamespace: (_namespace: Namespaces) => {
			namespace = _namespace
			return actions
		},
		setTypes: (_types: Types) => {
			types = _types
			return actions
		},
		setPath: (_path: string) => {
			filePath = _path
			return actions
		},
		inject: () => {
			if (!ARTISAN_COMPONENT_AUTOIMPORT) return
			if (!namespace) return error('injector namespace is undefined')
			if (!filePath) return error('injector path is undefined')

			for (const type of types) {
				const opts: Options = {
					path: filePath,
					namespace,
					type,
				}

				if (namespace === 'global') {
					injectInGlobal(opts)
					continue
				}

				if (namespace !== 'none') {
					injectInPage(opts)
					continue
				}
			}

			log('Component success injected')
		},
	}

	return actions
}
