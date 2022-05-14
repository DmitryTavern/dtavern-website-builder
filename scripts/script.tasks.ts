import * as path from 'path'
import * as gulp from 'gulp'
import * as server from 'browser-sync'
import * as babel from 'gulp-babel'
import * as rename from 'gulp-rename'
import * as types from './types'

import taskWrap from './helpers/taskWrap'
import compilerWrap from './helpers/compilerWrap'
import watchViews from './helpers/watchViews'

const {
	NODE_ENV,
	APP_COMPONENTS_DIR,
	APP_PAGES_SCRIPTS_DIR,
	APP_ASSETS_SCRIPTS_DIR,
	APP_ASSETS_SCRIPTS_VENDOR_DIR,
	APP_BUILD_DIRNAME,
	APP_BUILD_SCRIPTS_DIRNAME,
	APP_BUILD_SCRIPTS_VENDOR_DIRNAME,
} = process.env

const SCRIPTS_JS = path.join(APP_ASSETS_SCRIPTS_DIR, '/**/*.js')
const SCRIPTS_COMMON_JS = path.join(APP_ASSETS_SCRIPTS_DIR, '/*.js')
const SCRIPTS_VENDOR_JS = path.join(APP_ASSETS_SCRIPTS_VENDOR_DIR, '/**/*.js')

const PAGES_JS = path.join(APP_PAGES_SCRIPTS_DIR, '/**/*.js')
const COMPONENTS_JS = path.join(APP_COMPONENTS_DIR, '/**/*.js')

const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_SCRIPTS_DIRNAME)
const BUILD_VENDOR_DIR = path.join(
	APP_BUILD_DIRNAME,
	APP_BUILD_SCRIPTS_VENDOR_DIRNAME
)

const compiler: types.Compiler = (input: string) =>
	compilerWrap('[js]: compiling all pages', () => {
		if (NODE_ENV === 'development')
			return gulp
				.src(input)
				.pipe(rename({ dirname: '' }))
				.pipe(gulp.dest(BUILD_DIR))
				.pipe(server.reload({ stream: true }))

		if (NODE_ENV === 'production')
			return gulp
				.src(input)
				.pipe(
					babel({
						presets: ['@babel/env'],
					})
				)
				.pipe(rename({ dirname: '' }))
				.pipe(gulp.dest(BUILD_DIR))
	})

const vendorCompiler: types.Compiler = () =>
	compilerWrap('[js]: compiling vendor', () => {
		if (NODE_ENV === 'development')
			return gulp
				.src(SCRIPTS_VENDOR_JS)
				.pipe(rename({ dirname: '' }))
				.pipe(gulp.dest(BUILD_VENDOR_DIR))
				.pipe(server.reload({ stream: true }))

		if (NODE_ENV === 'production')
			return gulp
				.src(SCRIPTS_VENDOR_JS)
				.pipe(rename({ dirname: '' }))
				.pipe(gulp.dest(BUILD_VENDOR_DIR))
	})

export default taskWrap('[task]: run scripts services', (done: any) => {
	if (NODE_ENV === 'production') {
		gulp.series(
			vendorCompiler(),
			compiler(SCRIPTS_COMMON_JS),
			compiler(PAGES_JS)
		)(done)
		return
	}

	watchViews(PAGES_JS, compiler)

	gulp.watch(
		[SCRIPTS_JS, COMPONENTS_JS, `!${SCRIPTS_VENDOR_JS}`],
		{
			ignoreInitial: false,
		},
		gulp.series(compiler(SCRIPTS_COMMON_JS), compiler(PAGES_JS))
	)

	gulp.watch(
		[SCRIPTS_VENDOR_JS],
		{
			ignoreInitial: false,
		},
		vendorCompiler()
	)
}
)