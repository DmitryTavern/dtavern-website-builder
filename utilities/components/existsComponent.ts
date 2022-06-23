import * as fs from 'fs'
import * as types from '@types'
import { getComponents } from './getComponents'
import { getComponentInfo } from './getComponentInfo'
import { getComponentDirectory } from './getComponentDirectory'

export function existsComponentDirecotry(component: types.Component) {
	const directory = getComponentDirectory(component)

	return fs.existsSync(directory)
}

export function existsComponentByName(componentName: types.ComponentName) {
	const components = getComponents()

	for (const component of components) {
		const { name } = getComponentInfo(component)

		if (name === componentName) return true
	}

	return false
}
