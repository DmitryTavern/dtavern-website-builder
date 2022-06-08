import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'
import { __, log } from '../helpers/logger'
import { registerComponent } from './registerComponent'
import { unregisterComponent } from './unregisterComponent'
import { getComponentInfo, getComponentNamespace } from './utils'

const { APP_COMPONENTS_DIR } = process.env

export function renameComponent(oldComponent: string, newName: string) {
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
