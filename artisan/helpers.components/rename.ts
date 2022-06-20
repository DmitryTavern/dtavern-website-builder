import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'
import * as types from '../types'
import { getComponentNamespace } from '../helpers.namespaces'
import { unregisterComponent } from './unregister'
import { registerComponent } from './register'
import { getComponentInfo } from './utils'
import { __, log } from '../../helpers/logger'

const { APP_COMPONENTS_DIR } = process.env

export function renameComponent(
	oldComponent: types.Component,
	newName: string
) {
	const { category, name } = getComponentInfo(oldComponent)
	const namespace = getComponentNamespace(oldComponent)
	const oldDirPath = path.join(APP_COMPONENTS_DIR, category, name)
	const newDirPath = path.join(APP_COMPONENTS_DIR, category, newName)

	unregisterComponent(category, name)

	fs.renameSync(oldDirPath, newDirPath)

	const files = glob.sync(path.join(newDirPath, '/**/**.*'))

	for (const file of files) {
		const fileName = path.basename(file)

		fs.renameSync(
			path.join(newDirPath, fileName),
			path.join(newDirPath, fileName.replace(name, newName))
		)
	}

	registerComponent(namespace, category, newName)

	log(
		__('LOG_SUCCESS_COMPONENT_RENAMED', {
			oldName: oldComponent,
			newName,
		})
	)
}
