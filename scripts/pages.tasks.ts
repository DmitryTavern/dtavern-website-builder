import * as path from 'path'
import * as gulp from 'gulp'
import * as pug from 'gulp-pug'
import * as server from 'browser-sync'
import * as rename from 'gulp-rename'
import * as prettyHtml from 'gulp-html-prettify'
import * as plumber from 'gulp-plumber'
import * as notify from 'gulp-notify'
import * as types from '../types'
import {
	__,
	isDev,
	isProd,
	watchViews,
	watchComponents,
	setDisplayName,
} from '@utilities'

const {
	APP_VIEWS_DIR,
	APP_PAGES_DIR,
	APP_COMPONENTS_DIR,
	APP_BUILD_DIRNAME,
	APP_BUILD_PAGES_DIRNAME,
} = process.env

const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_PAGES_DIRNAME)
const VIEWS_PUG = path.join(APP_VIEWS_DIR, '/**/*.pug')
const PAGES_PUG = path.join(APP_PAGES_DIR, '/*.pug')
const PAGES_ALL_PUG = path.join(APP_PAGES_DIR, '/**/*.pug')
const COMPONENTS_PUG = path.join(APP_COMPONENTS_DIR, '/**/*.pug')

const compiler: types.Compiler = (input: string) => () => {
	if (isDev())
		return gulp
			.src(input)
			.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
			.pipe(pug())
			.pipe(rename({ dirname: '' }))
			.pipe(gulp.dest(BUILD_DIR))
			.pipe(server.stream())

	if (isProd())
		return gulp
			.src(input)
			.pipe(pug())
			.pipe(prettyHtml({ indent_char: ' ', indent_size: 2 }))
			.pipe(rename({ dirname: '' }))
			.pipe(gulp.dest(BUILD_DIR))
}

const taskName = __('TASK_HTML')
const taskCompilerGlobal = __('TASK_COMPILER_PAGE', {
	type: 'html',
	namespace: 'all',
})

export default setDisplayName(taskName, (done: any) => {
	const fn = setDisplayName(taskCompilerGlobal, compiler(PAGES_PUG))

	if (isProd()) {
		gulp.series(fn)(done)
		return
	}

	watchViews(APP_PAGES_DIR, compiler)

	watchComponents(COMPONENTS_PUG, {
		global: fn,
		page: compiler,
	})

	gulp.watch([VIEWS_PUG, `!${PAGES_ALL_PUG}`], fn)
})
