import * as path from 'path'
import * as gulp from 'gulp'
import * as server from 'browser-sync'
import * as plumber from 'gulp-plumber'
import * as notify from 'gulp-notify'
import * as types from '../types'

import { __, isDev, isProd, setDisplayName } from '@utilities'

const { APP_BUILD_DIRNAME, APP_ASSETS_FONTS_DIR, APP_BUILD_FONTS_DIRNAME } =
	process.env

const FONTS_FILES = path.join(APP_ASSETS_FONTS_DIR, '/**/*.*')
const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_FONTS_DIRNAME)

const compiler: types.Compiler = (input: string) => () => {
	if (isDev())
		return gulp
			.src(input)
			.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
			.pipe(gulp.dest(BUILD_DIR))
			.pipe(server.reload({ stream: true }))

	if (isProd()) return gulp.src(FONTS_FILES).pipe(gulp.dest(BUILD_DIR))
}

const taskName = __('TASK_FONTS')
const taskCompiler = __('TASK_COMPILER_FONT')

export default setDisplayName(taskName, (done: any) => {
	const fn = setDisplayName(taskCompiler, compiler(FONTS_FILES))

	if (isProd()) {
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
