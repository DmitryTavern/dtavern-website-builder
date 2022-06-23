import * as types from '@types'
import { __ } from '../logger'

interface ComponentInfo {
	category: types.ComponentCategory
	name: types.ComponentName
}

export function getComponentInfo(component: types.Component): ComponentInfo {
	const split = component.split('/')

	if (split.length !== 2) throw new Error(__('ERROR_COMPONENT_IS_NOT_CORRECT'))

	return {
		category: split[0],
		name: split[1],
	}
}
