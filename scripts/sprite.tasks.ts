import * as path from 'path'
import * as gulp from 'gulp'
import * as server from 'browser-sync'
import * as svgSprite from 'gulp-svg-sprite'
import * as plumber from 'gulp-plumber'
import * as notify from 'gulp-notify'
import * as types from '../types'

import { __, isProd, setDisplayName } from '@utilities'

const {
	APP_ASSETS_SPRITE_DIR,
	APP_BUILD_DIRNAME,
	APP_BUILD_IMAGES_DIRNAME,
	APP_SPRITE_FILENAME,
} = process.env

const SPRITE_ICONS = path.join(APP_ASSETS_SPRITE_DIR, '/*.svg')
const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_IMAGES_DIRNAME)

const compiler: types.Compiler = (input: string) => () => {
	return gulp
		.src(input)
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: '../' + APP_SPRITE_FILENAME,
					},
				},
			})
		)
		.pipe(gulp.dest(BUILD_DIR))
		.pipe(server.reload({ stream: true }))
}

const taskName = __('TASK_SPRITE')
const taskCompiler = __('TASK_COMPILER_SPRITE')

export default setDisplayName(taskName, (done: any) => {
	const fn = setDisplayName(taskCompiler, compiler(SPRITE_ICONS))

	if (isProd()) {
		gulp.series(fn)(done)
		return
	}

	gulp.watch(
		SPRITE_ICONS,
		{
			ignoreInitial: false,
		},
		fn
	)
})
