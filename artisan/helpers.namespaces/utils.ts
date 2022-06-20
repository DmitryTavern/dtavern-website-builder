import * as fs from 'fs'
import * as path from 'path'
import * as types from '../types'
import { getPageList } from '../helpers.pages'
import { readConfig } from '../helpers.components'

const {
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

const defaultPathes: ViewPathes = {
	pugPath: '',
	scssPath: '',
	jsPath: '',
	pugFileExists: false,
	scssFileExists: false,
	jsFileExists: false,
}

export function getComponentNamespace(
	component: types.Component
): types.Namespace {
	const namespaces = readConfig().toDefault()

	for (const namespace in namespaces) {
		if (namespaces[namespace].includes(component)) return namespace
	}

	return 'none'
}

export function getNamespaceComponents(namespace: types.Namespace) {
	return readConfig().toDefault()[namespace] || []
}

export function getNamespaceList(): types.Namespace[] {
	return ['global', ...getPageList(), 'none']
}

export function getNamespacePathes(namespace: types.Namespace): ViewPathes {
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
