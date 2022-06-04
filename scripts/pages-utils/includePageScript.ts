import * as fs from 'fs'
import { getNamespacePathes } from '../component-utils'
import { templateLoader } from '../helpers/templateLoader'

const { ARTISAN_TEMPLATE_JS_PAGE } = process.env
const findScriptRegexp = /\+script\(.*\n/
const findBlockRegexp = /block script\n/

export function includePageScript(pageName: string) {
	const pathes = getNamespacePathes(pageName)

	templateLoader().load(ARTISAN_TEMPLATE_JS_PAGE).write(pathes.jsPath)

	let pugData = fs.readFileSync(pathes.pugPath, { encoding: 'utf-8' })
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

	fs.writeFileSync(pathes.pugPath, pugData)
}
