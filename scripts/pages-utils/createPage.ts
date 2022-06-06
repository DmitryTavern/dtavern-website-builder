import { getNamespacePathes } from '../component-utils'
import { templateLoader } from '../helpers/templateLoader'
import { getPageTitle } from './getPageTitle'
import { mkdir } from '../helpers/mkdir'

const { APP_PAGES_DIR, ARTISAN_TEMPLATE_PUG_PAGE } = process.env

export function createPage(pageName: string) {
	const pathes = getNamespacePathes(pageName)

	mkdir(APP_PAGES_DIR)

	templateLoader()
		.load(ARTISAN_TEMPLATE_PUG_PAGE)
		.replace(`// @-title\n`, getPageTitle(pageName))
		.write(pathes.pugPath)
}
