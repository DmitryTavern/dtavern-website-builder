import * as fs from 'fs'
import * as path from 'path'
import { __ } from '../helpers/logger'
import { readConfig } from './componentsConfig'

const {
	APP_PROJECT_STORE,
	APP_COMPONENTS_DIR,
	APP_PAGES_DIR,
	APP_PAGES_STYLES_DIR,
	APP_PAGES_SCRIPTS_DIR,
	ARTISAN_COMPONENT_AUTOIMPORT_PUG_PATH,
	ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH,
	ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH,
} = process.env

interface ViewPathes {
	pugPath: string
	scssPath: string
	jsPath: string

	pugFileExists: boolean
	scssFileExists: boolean
	jsFileExists: boolean
}

const defaultPathes = {
	pugPath: '',
	scssPath: '',
	jsPath: '',
	pugFileExists: false,
	scssFileExists: false,
	jsFileExists: false,
}

const invalidNameValues = ['', 'global', 'none', 'common']
const invalidComponentNames = ['', 'components']

export function getComponentsStore() {
	if (!fs.existsSync(APP_PROJECT_STORE)) return []
	return fs
		.readdirSync(APP_PROJECT_STORE)
		.filter((file) =>
			fs.lstatSync(path.join(APP_PROJECT_STORE, file)).isDirectory()
		)
}

export function getPageList(): string[] {
	if (!fs.existsSync(APP_PAGES_DIR)) return []
	return fs
		.readdirSync(APP_PAGES_DIR)
		.filter((file) => path.extname(file) === '.pug')
		.map((file) => file.replace(/\..*/, ''))
}

export function existsPage(page: string) {
	return getPageList().includes(page)
}

export function getNamespaceList(): string[] {
	return ['global', ...getPageList(), 'none']
}

export function getNamespacePathes(namespace: string): ViewPathes {
	const result = { ...defaultPathes }

	namespace = namespace.replace(/\..*/, '')

	if (namespace === 'global') {
		result.pugPath = ARTISAN_COMPONENT_AUTOIMPORT_PUG_PATH
		result.scssPath = ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH
		result.jsPath = ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH
	}

	if (namespace !== 'global' && namespace !== 'none') {
		result.pugPath = path.join(APP_PAGES_DIR, `${namespace}.pug`)
		result.scssPath = path.join(APP_PAGES_STYLES_DIR, `${namespace}.scss`)
		result.jsPath = path.join(APP_PAGES_SCRIPTS_DIR, `${namespace}.js`)
	}

	result.pugFileExists = fs.existsSync(result.pugPath)
	result.scssFileExists = fs.existsSync(result.scssPath)
	result.jsFileExists = fs.existsSync(result.jsPath)

	return result
}

export function getNamespaceComponents(namespace: string) {
	return readConfig().toDefault()[namespace] || []
}

export function getComponentInfo(component: string) {
	const split = component.split('/')

	if (split.length !== 2) throw new Error(__('ERROR_COMPONENT_IS_NOT_CORRECT'))

	return {
		category: split[0],
		name: split[1],
	}
}

export function getComponentPathes(
	category: string,
	component: string
): ViewPathes {
	const result = { ...defaultPathes }
	const dir = path.join(APP_COMPONENTS_DIR, category, component)

	result.pugPath = path.join(dir, `${component}.pug`)
	result.scssPath = path.join(dir, `${component}.scss`)
	result.jsPath = path.join(dir, `${component}.js`)

	result.pugFileExists = fs.existsSync(result.pugPath)
	result.scssFileExists = fs.existsSync(result.scssPath)
	result.jsFileExists = fs.existsSync(result.jsPath)

	return result
}

export function getComponentNamespace(component: string): string {
	const namespaces = readConfig().toDefault()

	for (const namespace in namespaces) {
		if (namespaces[namespace].includes(component)) return namespace
	}

	return 'none'
}

export function existsComponentByCategory(category: string, name: string) {
	const components = readConfig().toOneArray()

	for (const component of components) {
		const info = getComponentInfo(component)

		if (info.category === category && info.name === name) {
			return true
		}
	}

	return false
}

export function checkComponentName(name: string) {
	return !invalidComponentNames.includes(name)
}

export function checkPageName(name: string) {
	return !invalidNameValues.includes(name)
}
