import * as fs from 'fs'
import * as path from 'path'
import * as gulp from 'gulp'
import * as types from '../types'
import { setDisplayName } from './setDisplayName'
import { warn, __ } from './logger'
import { mkdir } from './mkdir'
import {
	getComponentNamespace,
	getNamespacePathes,
} from '../component-utils/utils'

const { APP_COMPONENTS_DIR } = process.env

interface Compilers {
	global: ReturnType<types.Compiler>
	page: types.Compiler
}

export default (files: string, compilers: Compilers) => {
	mkdir(APP_COMPONENTS_DIR)

	gulp
		.watch(files, {
			ignoreInitial: true,
			ignored: /(^|[\/\\])\../,
		})
		.on('change', (file: string) => {
			const fileExt = path.extname(file).replace('.', '')
			const fileName = path.basename(path.dirname(file))
			const fileCategory = path.basename(path.dirname(path.dirname(file)))
			const component = `${fileCategory}/${fileName}`
			const namespace = getComponentNamespace(component)

			if (namespace === 'global') {
				gulp.series(compilers.global)(null)
			} else if (namespace !== 'none') {
				const pathes = getNamespacePathes(namespace)
				let path: string, type: string

				if (fileExt === 'pug' && pathes.pugFileExists) {
					path = pathes.pugPath
					type = 'html'
				}

				if (fileExt === 'scss' && pathes.scssFileExists) {
					path = pathes.scssPath
					type = 'style'
				}

				if (fileExt === 'js' && pathes.jsFileExists) {
					path = pathes.jsPath
					type = 'script'
				}

				if (path) {
					gulp.series(
						setDisplayName(
							__('TASK_COMPILER_COMPONENT', {
								name: component,
								type,
								namespace,
							}),
							compilers.page(path)
						)
					)(null)
				} else {
					warn(
						__('WARN_COMPILER_COMPONENTDIR', {
							ext: fileExt,
						})
					)
				}
			}
		})
}
