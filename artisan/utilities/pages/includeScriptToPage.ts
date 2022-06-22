import * as fs from 'fs'
import { getNamespacePathes } from '@utilities'

const findScriptRegexp = /\+script\(.*\n/
const findBlockRegexp = /block script\n/

export function includeScriptToPage(pageName: string) {
	const pathes = getNamespacePathes(pageName)

	let pugData = fs.readFileSync(pathes.pugFile, { encoding: 'utf-8' })
	let replaceData = ''

	const findScriptResult = pugData.match(findScriptRegexp)
	const findBlockResult = pugData.match(findBlockRegexp)

	if (findScriptResult) {
		replaceData = findScriptResult[0]
	} else if (findBlockResult) {
		replaceData = findBlockResult[0]
	} else {
		replaceData = `block script\n`
		pugData += `\nblock script\n`
	}

	pugData = pugData.replace(
		replaceData,
		replaceData + `\t+script('${pageName}.js')\n`
	)

	fs.writeFileSync(pathes.pugFile, pugData)
}
