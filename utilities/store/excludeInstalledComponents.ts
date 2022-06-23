import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'

const { APP_PROJECT_STORE } = process.env

export function excludeInstalledComponents(
	installed: types.Component[],
	store: types.Component[]
): types.Component[] {
	return store.filter((component) => {
		const componentDirectory = path.join(APP_PROJECT_STORE, component)
		const isDirectory = fs.statSync(componentDirectory).isDirectory()
		const existsInInstalled = installed.includes(component)

		if (isDirectory && !existsInInstalled) return true
		return false
	})
}
