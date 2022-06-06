import * as fs from 'fs'
import * as path from 'path'
import * as gulp from 'gulp'
import * as types from '../types'
import { mkdir } from './mkdir'
import { warn } from './logger'

const watchers = {}

const getFileInfo = (string: string) => {
	const pagename = path.basename(string).replace(/\..*$/, '')

	return { pagename }
}

const getDirInfo = (string: string) => {
	const dirname = path.basename(string)

	return { dirname }
}

interface getCompilerOptions {
	msg: string
	path: string
	compiler: types.Compiler
}

const getCompiler = (options: getCompilerOptions) => {
	const compilerReturn = options.compiler(options.path)
	const fn = (done: any) => {
		if (!fs.existsSync(options.path)) return
		return compilerReturn(done)
	}

	fn.displayName = options.msg

	return fn
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
			const { pagename } = getFileInfo(pagefile)

			const fn = getCompiler({
				msg: `compiling '${pagename}' page`,
				path: pagefile,
				compiler,
			})

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
					`You created '${dirname}' dir in ${dir}, but file for this dir not found. Watcher will be ignore it.`
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
