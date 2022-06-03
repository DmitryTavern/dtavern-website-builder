import * as fs from 'fs'
import * as path from 'path'
import { templateLoader } from '../helpers/templateLoader'

const { APP_PAGES_DIR, APP_PAGES_SCRIPTS_DIR, ARTISAN_TEMPLATE_JS_PAGE } =
	process.env
const findScriptRegexp = /\+script\(.*\n/
const findBlockRegexp = /block script\n/

export function includePageScript(pageName: string) {
	const pugPath = path.join(APP_PAGES_DIR, `${pageName}.pug`)
	const jsPath = path.join(APP_PAGES_SCRIPTS_DIR, `${pageName}.js`)
	let pugData = fs.readFileSync(pugPath, { encoding: 'utf-8' })
	let replaceData = ''

	templateLoader().load(ARTISAN_TEMPLATE_JS_PAGE).write(jsPath)

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

	fs.writeFileSync(pugPath, pugData)
}
