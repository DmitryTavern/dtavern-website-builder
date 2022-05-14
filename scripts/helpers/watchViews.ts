import * as gulp from 'gulp'
import * as types from '../types'

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
			const fn = compiler(path)

			fn.displayName = `compiling ${pagename} page`

			gulp.watch([path, pathDir], fn)
		})
}
