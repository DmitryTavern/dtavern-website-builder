import * as fs from 'fs'
import { mkdir, templateLoader, getNamespacePathes } from '@utilities'

const { APP_PAGES_STYLES_DIR, ARTISAN_TEMPLATE_SCSS_PAGE } = process.env

export function createPageStyle(pageName: string) {
	const pathes = getNamespacePathes(pageName)
	const templatePath = ARTISAN_TEMPLATE_SCSS_PAGE

	mkdir(APP_PAGES_STYLES_DIR)

	const data = templateLoader(templatePath)

	fs.writeFileSync(pathes.scssFile, data, 'utf-8')
}
