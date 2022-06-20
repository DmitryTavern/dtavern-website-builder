import * as fs from 'fs'
import * as path from 'path'
import { __ } from '../../helpers/logger'

const { APP_PROJECT_NAME, APP_PAGES_DIR } = process.env

const invalidNameValues = ['', 'global', 'none', 'common']

function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getPageList(): string[] {
	if (!fs.existsSync(APP_PAGES_DIR)) return []
	return fs
		.readdirSync(APP_PAGES_DIR)
		.filter((file) => path.extname(file) === '.pug')
		.map((file) => file.replace(/\..*/, ''))
}

export function existsPage(page: string) {
	return getPageList().includes(page)
}

export function checkPageName(name: string) {
	return !invalidNameValues.includes(name)
}

export function getPageTitle(pageName: string) {
	return `title ${capitalize(pageName).replace(
		/-/gm,
		' '
	)} | ${APP_PROJECT_NAME}\n`
}
