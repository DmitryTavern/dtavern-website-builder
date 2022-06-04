import { getNamespacePathes } from '../component-utils'
import { templateLoader } from '../helpers/templateLoader'
import { capitalize } from '../helpers/textTransformUtils'

const { APP_PROJECT_NAME, ARTISAN_TEMPLATE_PUG_PAGE } = process.env

export function createPage(pageName: string) {
	const pathes = getNamespacePathes(pageName)

	const titleContent = `title ${capitalize(pageName)} | ${APP_PROJECT_NAME}\n`

	templateLoader()
		.load(ARTISAN_TEMPLATE_PUG_PAGE)
		.replace(`// @-title\n`, titleContent)
		.write(pathes.pugPath)
}
