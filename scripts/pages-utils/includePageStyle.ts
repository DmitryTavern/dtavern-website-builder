import * as fs from 'fs'
import * as path from 'path'
import { error } from '../helpers/logger'
import { templateLoader } from '../helpers/templateLoader'

const { APP_PAGES_DIR, APP_PAGES_STYLES_DIR, ARTISAN_TEMPLATE_SCSS_PAGE } =
	process.env
const findStyleRegexp = /\+style\(.*\n/
const findTitleRegexp = /title .*\n/

export function includePageStyle(pageName: string) {
	const pugPath = path.join(APP_PAGES_DIR, `${pageName}.pug`)
	const scssPath = path.join(APP_PAGES_STYLES_DIR, `${pageName}.scss`)
	let pugData = fs.readFileSync(pugPath, { encoding: 'utf-8' })
	let replaceData = ''

	templateLoader().load(ARTISAN_TEMPLATE_SCSS_PAGE).write(scssPath)

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

	fs.writeFileSync(pugPath, pugData)
}
