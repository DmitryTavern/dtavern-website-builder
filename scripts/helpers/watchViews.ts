import * as fs from 'fs'
import * as gulp from 'gulp'
import * as types from '../types'

const watchers = {}

export default (files: string, compiler: types.Compiler) => {
	gulp
		.watch(files, {
			ignoreInitial: false,
			ignored: /(^|[\/\\])\../,
			depth: 0,
		})
		.on('add', (path: string) => {
			const array: string[] = path.split('/')
			const pagename = array[array.length - 1]
			const dirname = array[array.length - 1].replace(/\..*$/, '')
			const pathDir = path.replace(pagename, dirname + '/**/**.**')
			const compilerReturn = compiler(path)
			const fn = (done: any) => {
				if (!fs.existsSync(path)) return
				return compilerReturn(done)
			}

			fn.displayName = `compiling ${pagename} page`

			watchers[pagename] = gulp.watch(
				[path, pathDir],
				{ ignoreInitial: false },
				fn
			)
		})
		.on('unlink', (path: string) => {
			const array: string[] = path.split('/')
			const pagename = array[array.length - 1]
			if (watchers[pagename]) {
				watchers[pagename].close()
				delete watchers[pagename]
			}
		})
}
