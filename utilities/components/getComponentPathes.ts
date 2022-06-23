import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'
import { getComponentDirectory } from './getComponentDirectory'
import { getComponentInfo } from './getComponentInfo'

interface ViewPathes {
	pugFile: string
	scssFile: string
	jsFile: string
	variablesFile: string
	vendorDir: string
}

export function getComponentPathes(component: types.Component): ViewPathes {
	const { name } = getComponentInfo(component)
	const directory = getComponentDirectory(component)

	return {
		pugFile: path.join(directory, `${name}.pug`),
		scssFile: path.join(directory, `${name}.scss`),
		jsFile: path.join(directory, `${name}.js`),
		vendorDir: path.join(directory, 'vendor'),
		variablesFile: path.join(directory, '_variables.scss'),
	}
}
