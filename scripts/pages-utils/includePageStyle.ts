import * as fs from 'fs'
import { getNamespacePathes } from '../component-utils'
import { templateLoader } from '../helpers/templateLoader'

const { ARTISAN_TEMPLATE_SCSS_PAGE } = process.env
const findStyleRegexp = /\+style\(.*\n/
const findTitleRegexp = /title .*\n/

export function includePageStyle(pageName: string) {
	const pathes = getNamespacePathes(pageName)

	templateLoader().load(ARTISAN_TEMPLATE_SCSS_PAGE).write(pathes.scssPath)

	let pugData = fs.readFileSync(pathes.pugPath, { encoding: 'utf-8' })
	let replaceData = ''

	const findStyleResult = pugData.match(findStyleRegexp)
	const findTitleResult = pugData.match(findTitleRegexp)

	if (findStyleResult) {
		replaceData = findStyleResult[0]
	} else if (findTitleResult) {
		replaceData = findTitleResult[0]
	} else {
		replaceData = 'block head\n'
	}

	pugData = pugData.replace(
		replaceData,
		replaceData + `\t+style('${pageName}.css')\n`
	)

	fs.writeFileSync(pathes.pugPath, pugData)
}
