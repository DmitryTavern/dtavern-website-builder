import * as fs from 'fs'
import * as path from 'path'
import * as gulp from 'gulp'
import * as types from '../types'
import { mkdir } from './mkdir'
import { warn } from './logger'
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
			const fileName = path.basename(path.dirname(file))
			const fileCategory = path.basename(path.dirname(path.dirname(file)))
			const fileExt = path.extname(file).replace('.', '')
			const namespace = getComponentNamespace(`${fileCategory}/${fileName}`)

			if (namespace === 'global') {
				compilers.global(null)
			} else if (namespace !== 'none') {
				const pathes = getNamespacePathes(namespace)
				let compiler = null

				if (fileExt === 'pug' && pathes.pugFileExists)
					compiler = compilers.page(
						pathes.pugPath,
						`[pug]: compiling '${namespace}' page`
					)

				if (fileExt === 'scss' && pathes.scssFileExists)
					compiler = compilers.page(
						pathes.scssPath,
						`[scss]: compiling '${namespace}' page`
					)

				if (fileExt === 'js' && pathes.jsFileExists)
					compiler = compilers.page(
						pathes.jsPath,
						`[js]: compiling '${namespace}' page`
					)

				if (compiler) {
					gulp.series(compiler)(null)
				} else {
					warn(
						`[componentWatcher]: Not found file ext '${fileExt}' or component imports to not exist page assets`
					)
				}
			}
		})
}
