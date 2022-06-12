import * as path from 'path'
import * as gulp from 'gulp'
import * as server from 'browser-sync'
import * as sass from 'sass'
import * as gulpSass from 'gulp-sass'
import * as gcmq from 'gulp-group-css-media-queries'
import * as rename from 'gulp-rename'
import * as cssnano from 'gulp-cssnano'
import * as autoprefixer from 'gulp-autoprefixer'
import * as plumber from 'gulp-plumber'
import * as notify from 'gulp-notify'
import * as types from './types'

import watchViews from './helpers/watchViews'
import watchComponents from './helpers/watchComponents'
import { setDisplayName } from './helpers/setDisplayName'
import { isDev, isProd } from './helpers/mode'
import { __ } from './helpers/logger'

const {
	APP_ASSETS_STYLES_DIR,
	APP_PAGES_STYLES_DIR,
	APP_COMPONENTS_DIR,
	APP_BUILD_DIRNAME,
	APP_BUILD_STYLES_DIRNAME,
} = process.env

const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_STYLES_DIRNAME)
const STYLES_SASS = path.join(APP_ASSETS_STYLES_DIR, '/**/*.scss')
const STYLES_COMMON_SASS = path.join(APP_ASSETS_STYLES_DIR, '/*.scss')
const PAGES_SASS = path.join(APP_PAGES_STYLES_DIR, '/*.scss')
const COMPONENTS_SASS = path.join(APP_COMPONENTS_DIR, '/**/*.scss')

const sassGulp = gulpSass(sass)

const compiler: types.Compiler = (input: string) => () => {
	if (isDev())
		return gulp
			.src(input)
			.pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))
			.pipe(sassGulp())
			.pipe(gcmq())
			.pipe(rename({ dirname: '' }))
			.pipe(gulp.dest(BUILD_DIR))
			.pipe(server.stream())

	if (isProd())
		return gulp
			.src(input)
			.pipe(sassGulp().on('error', sassGulp.logError))
			.pipe(
				autoprefixer({
					cascade: false,
				})
			)
			.pipe(gcmq())
			.pipe(rename({ dirname: '' }))
			.pipe(gulp.dest(BUILD_DIR))
			.pipe(rename({ suffix: '.min' }))
			.pipe(cssnano())
			.pipe(gulp.dest(BUILD_DIR))
}

const taskName = __('TASK_STYLE')
const taskCompilerPages = __('TASK_COMPILER_STYLE_PAGES')
const taskCompilerGlobal = __('TASK_COMPILER_STYLE_GLOBAL')

export default setDisplayName(taskName, (done: any) => {
	const fn = setDisplayName(taskCompilerGlobal, compiler(STYLES_COMMON_SASS))
	const fnPages = setDisplayName(taskCompilerPages, compiler(PAGES_SASS))

	if (isProd()) {
		gulp.series(fn, fnPages)(done)
		return
	}

	watchViews(APP_PAGES_STYLES_DIR, compiler)

	watchComponents(COMPONENTS_SASS, {
		global: fn,
		page: compiler,
	})

	gulp.watch(
		STYLES_SASS,
		{
			ignoreInitial: false,
		},
		fn
	)
})
