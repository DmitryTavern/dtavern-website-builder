import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'

const { APP_COMPONENTS_DIR } = process.env

export function getCategories(): types.ComponentCategory[] {
	if (!fs.existsSync(APP_COMPONENTS_DIR)) return []

	return fs
		.readdirSync(APP_COMPONENTS_DIR)
		.filter((file) =>
			fs.lstatSync(path.join(APP_COMPONENTS_DIR, file)).isDirectory()
		)
}
