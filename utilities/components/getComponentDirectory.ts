import * as path from 'path'
import * as types from '@types'

const { APP_COMPONENTS_DIR } = process.env

export function getComponentDirectory(
	component: types.Component
): types.ComponentDirectory {
	return path.join(APP_COMPONENTS_DIR, component)
}
