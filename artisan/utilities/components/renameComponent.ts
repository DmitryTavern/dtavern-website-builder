import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'
import * as types from '@types'
import {
	getComponentInfo,
	registerComponent,
	unregisterComponent,
	getNamespaceByComponent,
} from '@utilities'

const { APP_COMPONENTS_DIR } = process.env

export function renameComponent(component: types.Component, newName) {
	const { category, name } = getComponentInfo(component)
	const namespace = getNamespaceByComponent(component)
	const oldDirPath = path.join(APP_COMPONENTS_DIR, category, name)
	const newDirPath = path.join(APP_COMPONENTS_DIR, category, newName)

	unregisterComponent(component)

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
}
