import * as types from '@types'

const invalidComponentNames = ['', 'components', 'common', 'style', 'script']

export function checkComponentName(name: types.ComponentName) {
	return !invalidComponentNames.includes(name)
}
