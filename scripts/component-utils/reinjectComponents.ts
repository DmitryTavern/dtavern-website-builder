import * as fs from 'fs'
import * as path from 'path'
import { log } from '../helpers/logger'
import { readConfig, ComponentsConfig } from './componentsConfig'
import { includePageScript, includePageStyle } from '../pages-utils'

type Namespace = 'all' | 'global' | 'none' | string

const {
	APP_COMPONENTS_DIR,
	APP_PAGES_DIR,
	APP_PAGES_STYLES_DIR,
	APP_PAGES_SCRIPTS_DIR,
	ARTISAN_COMPONENT_AUTOIMPORT_PUG_PATH,
	ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH,
	ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH,
} = process.env

let config: ComponentsConfig | undefined

const extentionReplaceFns = {
	pug: () => `include .*\/components\/.*\n`,
	scss: () => `@import .*\/components\/.*\n`,
	js: () => `require\\(.*\/components\/.*\n`,
}

const extentionInjectFns = {
	pug: (path: string) => `include ${path}\n`,
	scss: (path: string) => `@import '${path}';\n`,
	js: (path: string) => `require\('${path}')\n`,
}

const checkNamespaceFiles = (namespace: string) => {
	const components = config[namespace] || []
	const exts = ['scss', 'js']
	const extsChecked = {}
	let scssPath = ''
	let jsPath = ''

	for (const ext of exts) {
		for (const component of components) {
			const [category, name] = component.split('/')
			const componentPath = path.join(
				APP_COMPONENTS_DIR,
				category,
				name,
				`${name}.${ext}`
			)

			if (fs.existsSync(componentPath)) {
				extsChecked[ext] = true
				break
			}
		}
	}

	if (namespace === 'global') {
		scssPath = ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH
		jsPath = ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH
	}

	if (namespace !== 'global' && namespace !== 'none') {
		scssPath = path.join(APP_PAGES_STYLES_DIR, `${namespace}.scss`)
		jsPath = path.join(APP_PAGES_SCRIPTS_DIR, `${namespace}.js`)
	}

	if (!fs.existsSync(scssPath) && extsChecked.hasOwnProperty('scss')) {
		log(`For '${namespace}' page was created style file`)
		includePageStyle(namespace)
	}

	if (!fs.existsSync(jsPath) && extsChecked.hasOwnProperty('js')) {
		log(`For '${namespace}' page was created script file`)
		includePageScript(namespace)
	}
}

const loadNamespaceFiles = (namespace: string): string[] => {
	const pugPath = path.join(APP_PAGES_DIR, `${namespace}.pug`)
	const scssPath = path.join(APP_PAGES_STYLES_DIR, `${namespace}.scss`)
	const jsPath = path.join(APP_PAGES_SCRIPTS_DIR, `${namespace}.js`)
	const paths = []

	if (fs.existsSync(pugPath)) paths.push(pugPath)
	if (fs.existsSync(scssPath)) paths.push(scssPath)
	if (fs.existsSync(jsPath)) paths.push(jsPath)

	return paths
}

const loadNamespaces = () => {
	const namespaceFiles = {
		global: [
			ARTISAN_COMPONENT_AUTOIMPORT_PUG_PATH,
			ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH,
			ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH,
		],
	}

	const namespaces = fs
		.readdirSync(APP_PAGES_DIR)
		.filter((file) => fs.lstatSync(path.join(APP_PAGES_DIR, file)).isFile())
		.map((file) => file.replace(/\..*/, ''))

	for (const namespace of namespaces) {
		namespaceFiles[namespace] = loadNamespaceFiles(namespace)
	}

	return namespaceFiles
}

const reinjectComponentsInFile = (namespace: string, file: string) => {
	const components = config[namespace] || []
	const fileExt = path.extname(file).replace('.', '')
	let fileData = fs.readFileSync(file, { encoding: 'utf-8' })

	const contentToReplace = extentionReplaceFns[fileExt]()
	let contentForReplace = ''

	for (const component of components) {
		const [category, name] = component.split('/')
		const componentPath = path.join(
			APP_COMPONENTS_DIR,
			category,
			name,
			`${name}.${fileExt}`
		)

		const includePath = path.relative(file, componentPath)

		if (fs.existsSync(componentPath)) {
			contentForReplace += extentionInjectFns[fileExt](includePath)
		}
	}

	contentForReplace += '// @-auto-import\n'

	fileData = fileData.replace(new RegExp(contentToReplace, 'gm'), '')
	fileData = fileData.replace('// @-auto-import\n', contentForReplace)

	fs.writeFileSync(file, fileData)
}

export function reinjectComponents(namespace: Namespace) {
	config = readConfig().toDefault()

	for (const key in config) {
		checkNamespaceFiles(key)
	}

	const namespaces = loadNamespaces()

	for (const key in namespaces) {
		if (namespace === 'all' || namespace === key) {
			for (const file of namespaces[key]) {
				reinjectComponentsInFile(key, file)
			}
		}
	}

	log(`${namespace} namespace components success reinjected.`)
}
