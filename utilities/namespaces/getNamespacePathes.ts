import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'

const {
	APP_PAGES_DIR,
	APP_PAGES_STYLES_DIR,
	APP_PAGES_SCRIPTS_DIR,
	ARTISAN_COMPONENT_AUTOIMPORT_PUG_PATH,
	ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH,
	ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH,
} = process.env

interface ViewPathes {
	pugFile: string
	scssFile: string
	jsFile: string
}

export function getNamespacePathes(namespace: types.Namespace): ViewPathes {
	namespace = namespace.replace(/\..*/, '')

	if (namespace === 'global') {
		return {
			pugFile: ARTISAN_COMPONENT_AUTOIMPORT_PUG_PATH,
			scssFile: ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH,
			jsFile: ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH,
		}
	}

	return {
		pugFile: path.join(APP_PAGES_DIR, `${namespace}.pug`),
		scssFile: path.join(APP_PAGES_STYLES_DIR, `${namespace}.scss`),
		jsFile: path.join(APP_PAGES_SCRIPTS_DIR, `${namespace}.js`),
	}
}
