import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'
import { readConfig } from './config'
import { getComponent } from './getComponent'
import { getCategories } from '../categories'

const { APP_COMPONENTS_DIR } = process.env

export function getComponents(): types.Component[] {
	const config = readConfig()
	const components: types.Component[] = []

	for (const namespace in config) {
		components.push(...config[namespace])
	}

	return components
}

export function getComponentsFormDrive(): types.Component[] {
	const categories = getCategories()
	const components: types.Component[] = []

	for (const category of categories) {
		const categoryComponents = fs
			.readdirSync(path.join(APP_COMPONENTS_DIR, category))
			.filter((name) =>
				fs
					.lstatSync(path.join(APP_COMPONENTS_DIR, category, name))
					.isDirectory()
			)

		for (const name of categoryComponents) {
			const component = getComponent(category, name)

			components.push(component)
		}
	}

	return components
}

export function getComponentsOfNamespace(
	namespace: types.Namespace
): types.Component[] {
	return readConfig()[namespace] || []
}
