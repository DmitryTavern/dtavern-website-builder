import * as path from 'path'
import * as gulp from 'gulp'
import * as server from 'browser-sync'
import * as types from './types'

import { setDisplayName } from './helpers/setDisplayName'
import { __ } from './helpers/logger'

const {
	NODE_ENV,
	APP_BUILD_DIRNAME,
	APP_ASSETS_FONTS_DIR,
	APP_BUILD_FONTS_DIRNAME,
} = process.env

const taskName = __('TASK_FONTS')
const taskCompiler = __('TASK_COMPILER_FONT')
const FONTS_FILES = path.join(APP_ASSETS_FONTS_DIR, '/**/*.*')
const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_FONTS_DIRNAME)

const compiler: types.Compiler = (input: string) => () => {
	if (NODE_ENV === 'development')
		return gulp
			.src(input)
			.pipe(gulp.dest(BUILD_DIR))
			.pipe(server.reload({ stream: true }))

	if (NODE_ENV === 'production')
		return gulp.src(FONTS_FILES).pipe(gulp.dest(BUILD_DIR))
}

export default setDisplayName(taskName, (done: any) => {
	const fn = setDisplayName(taskCompiler, compiler(FONTS_FILES))

	if (NODE_ENV === 'production') {
		gulp.series(fn)(done)
		return
	}

	gulp.watch(
		FONTS_FILES,
		{
			ignoreInitial: false,
		},
		fn
	)
})
