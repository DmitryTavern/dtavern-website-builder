import * as fs from 'fs'
import {
	__,
	log,
	mkdir,
	existsPage,
	templateLoader,
	createPageTitle,
	getNamespacePathes,
} from '@utilities'

const { APP_PAGES_DIR, ARTISAN_TEMPLATE_PUG_PAGE } = process.env

export function createPage(pageName: string) {
	if (existsPage(pageName)) return

	const pathes = getNamespacePathes(pageName)
	const templatePath = ARTISAN_TEMPLATE_PUG_PAGE
	const templateOptions = {
		title: createPageTitle(pageName),
	}

	mkdir(APP_PAGES_DIR)

	const data = templateLoader(templatePath, templateOptions)

	fs.writeFileSync(pathes.pugFile, data, 'utf-8')

	log(__('LOG_SUCCESS_PAGE_ADDED', { name: pageName }))
}
