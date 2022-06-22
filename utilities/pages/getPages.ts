import * as fs from 'fs'
import * as path from 'path'

const { APP_PAGES_DIR } = process.env

export function getPages(): string[] {
	if (!fs.existsSync(APP_PAGES_DIR)) return []
	return fs
		.readdirSync(APP_PAGES_DIR)
		.filter((file) => path.extname(file) === '.pug')
		.map((file) => file.replace(/\..*/, ''))
}
