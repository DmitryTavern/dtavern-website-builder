import { getNamespacePathes } from '../component-utils'
import { templateLoader } from '../helpers/templateLoader'
import { getPageTitle } from './getPageTitle'

const { ARTISAN_TEMPLATE_PUG_PAGE } = process.env

export function createPage(pageName: string) {
	const pathes = getNamespacePathes(pageName)

	templateLoader()
		.load(ARTISAN_TEMPLATE_PUG_PAGE)
		.replace(`// @-title\n`, getPageTitle(pageName))
		.write(pathes.pugPath)
}
