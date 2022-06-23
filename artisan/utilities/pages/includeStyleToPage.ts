import * as fs from 'fs'
import { getNamespacePathes } from '@utilities'

const findStyleRegexp = /\+style\(.*\n/
const findTitleRegexp = /title .*\n/

export function includeStyleToPage(pageName: string) {
	const pathes = getNamespacePathes(pageName)

	let pugData = fs.readFileSync(pathes.pugFile, { encoding: 'utf-8' })
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

	fs.writeFileSync(pathes.pugFile, pugData)
}
