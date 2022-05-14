import * as path from 'path'
import * as gulp from 'gulp'
import * as pug from 'gulp-pug'
import * as server from 'browser-sync'
import * as rename from 'gulp-rename'
import * as prettyHtml from 'gulp-pretty-html'
import * as types from './types'

import taskWrap from './helpers/taskWrap'
import compilerWrap from './helpers/compilerWrap'
import watchViews from './helpers/watchViews'

const {
	NODE_ENV,
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

const compiler: types.Compiler = (input: string) =>
	compilerWrap('[pug]: compiling all pages', () => {
		if (NODE_ENV === 'development')
			return gulp
				.src(input)
				.pipe(pug())
				.pipe(rename({ dirname: '' }))
				.pipe(gulp.dest(BUILD_DIR))
				.pipe(server.stream())

		if (NODE_ENV === 'production')
			return gulp
				.src(input)
				.pipe(pug())
				.pipe(prettyHtml())
				.pipe(rename({ dirname: '' }))
				.pipe(gulp.dest(BUILD_DIR))
	})

export default taskWrap('[task]: run pages services', (done: any) => {
	if (NODE_ENV === 'production') return compiler(PAGES_PUG)(done)

	watchViews(PAGES_PUG, compiler)

	gulp.watch(
		[VIEWS_PUG, COMPONENTS_PUG, `!${PAGES_ALL_PUG}`],
		{
			ignoreInitial: false,
		},
		compiler(PAGES_PUG)
	)
})
