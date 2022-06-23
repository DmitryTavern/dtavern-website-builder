import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'

const { APP_PROJECT_STORE } = process.env

export function getStoreCategories(): types.ComponentCategory[] {
	if (!fs.existsSync(APP_PROJECT_STORE)) return []

	return fs
		.readdirSync(APP_PROJECT_STORE)
		.filter(
			(fileName) =>
				fs.statSync(path.join(APP_PROJECT_STORE, fileName)).isDirectory() &&
				fileName !== '.git'
		)
}
