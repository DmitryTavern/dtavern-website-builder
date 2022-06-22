import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'
import { getComponent } from '../components'

const { APP_PROJECT_STORE } = process.env

export function getStoreComponentsByCategory(
	category: types.ComponentCategory
): types.Component[] {
	return fs
		.readdirSync(path.join(APP_PROJECT_STORE, category))
		.map((name) => getComponent(category, name))
}
