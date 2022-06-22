import * as fs from 'fs'
import { mkdir, templateLoader, getNamespacePathes } from '@utilities'

const { APP_PAGES_SCRIPTS_DIR, ARTISAN_TEMPLATE_JS_PAGE } = process.env

export function createPageScript(pageName: string) {
	const pathes = getNamespacePathes(pageName)
	const templatePath = ARTISAN_TEMPLATE_JS_PAGE

	mkdir(APP_PAGES_SCRIPTS_DIR)

	const data = templateLoader(templatePath)

	fs.writeFileSync(pathes.jsFile, data, 'utf-8')
}
