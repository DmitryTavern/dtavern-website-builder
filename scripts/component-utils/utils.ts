import * as fs from 'fs'
import * as path from 'path'
import { readConfig } from './componentsConfig'

const {
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

export function getNamespaceList(): string[] {
	const pages = fs
		.readdirSync(APP_PAGES_DIR)
		.filter((file) => path.extname(file) === '.pug')
		.map((file) => file.replace(/\..*/, ''))

	return ['global', ...pages, 'none']
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
