import * as fs from 'fs'
import * as path from 'path'
import * as gulp from 'gulp'
import * as types from '../types'
import { setDisplayName } from './setDisplayName'
import { __, warn } from './logger'
import { mkdir } from './mkdir'

const watchers = {}

const getFileInfo = (string: string) => {
	const ext = path.extname(string).replace('.', '')
	const pagename = path.basename(string).replace(/\..*$/, '')

	return { pagename, ext }
}

const getDirInfo = (string: string) => {
	const dirname = path.basename(string)

	return { dirname }
}

const getCompiler = (
	path: string,
	compiler: types.Compiler
): ReturnType<types.Compiler> => {
	const compilerReturn = compiler(path)

	return (done: any) => {
		if (!fs.existsSync(path)) return
		return compilerReturn(done)
	}
}

export default (dir: string, compiler: types.Compiler) => {
	mkdir(dir)

	gulp
		.watch(dir, {
			ignoreInitial: false,
			ignored: /(^|[\/\\])\../,
			depth: 0,
		})
		.on('add', (pagefile: string) => {
			const { ext, pagename } = getFileInfo(pagefile)
			let type = ''

			if (ext === 'pug') type = 'html'
			if (ext === 'scss') type = 'style'
			if (ext === 'js') type = 'script'

			const fn = setDisplayName(
				__('TASK_COMPILER_PAGE', { type, namespace: pagename }),
				getCompiler(pagefile, compiler)
			)

			watchers[pagename] = gulp.watch(pagefile, { ignoreInitial: false }, fn)
		})
		.on('addDir', (pagedir: string) => {
			if (pagedir === dir) return

			const { dirname } = getDirInfo(pagedir)
			const watchDir = path.join(pagedir, '/**/**.*')

			if (watchers[dirname]) {
				watchers[dirname].add(watchDir)
			} else {
				warn(
					__('WARN_COMPILER_PAGEDIR', {
						dirname,
						dir,
					})
				)
			}
		})
		.on('unlink', (pagefile: string) => {
			const { pagename } = getFileInfo(pagefile)

			if (watchers[pagename]) {
				watchers[pagename].close()
				delete watchers[pagename]
			}
		})
		.on('unlinkDir', (pagedir: string) => {
			const { dirname } = getDirInfo(pagedir)
			const watchDir = path.join(pagedir, '/**/**.*')

			if (watchers[dirname]) {
				watchers[dirname].unwatch(watchDir)
			}
		})
}
