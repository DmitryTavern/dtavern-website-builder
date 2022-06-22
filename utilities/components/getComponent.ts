import * as types from '@types'

export function getComponent(
	category: types.ComponentCategory,
	name: types.ComponentName
): types.Component {
	return `${category}/${name}`
}
