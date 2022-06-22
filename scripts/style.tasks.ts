import * as path from 'path'
import * as gulp from 'gulp'
import * as server from 'browser-sync'
import * as sass from 'sass'
import * as gulpSass from 'gulp-sass'
import * as gcmq from 'gulp-group-css-media-queries'
import * as clean from 'gulp-clean-css'
import * as rename from 'gulp-rename'
import * as cssnano from 'gulp-cssnano'
import * as autoprefixer from 'gulp-autoprefixer'
import * as types from './types'

import taskWrap from './helpers/taskWrap'
import compilerWrap from './helpers/compilerWrap'
import watchViews from './helpers/watchViews'

const {
	NODE_ENV,
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

const compiler: types.Compiler = (input: string, msg: string) =>
	compilerWrap(msg ? msg : '[sass]: compiling all pages', () => {
		if (NODE_ENV === 'development')
			return gulp
				.src(input)
				.pipe(sassGulp().on('error', sassGulp.logError))
				.pipe(gcmq())
				.pipe(rename({ dirname: '' }))
				.pipe(gulp.dest(BUILD_DIR))
				.pipe(server.stream())

		if (NODE_ENV === 'production')
			return gulp
				.src(input)
				.pipe(sassGulp().on('error', sassGulp.logError))
				.pipe(
					autoprefixer({
						browsers: [
							'> 0.2%',
							'last 8 versions',
							'not dead',
							'not op_mini all',
							'android >= 4',
							'chrome >= 45',
							'ff >= 45',
							'safari >= 7',
							'opera >= 23',
							'ios >= 7',
							'bb >= 10',
						],
						cascade: false,
					})
				)
				.pipe(clean())
				.pipe(gcmq())
				.pipe(cssnano())
				.pipe(rename({ dirname: '' }))
				.pipe(gulp.dest(BUILD_DIR))
	})

export default taskWrap('[task]: run styles services', (done: any) => {
	if (NODE_ENV === 'production') {
		gulp.series(compiler(STYLES_COMMON_SASS), compiler(PAGES_SASS))(done)
		return
	}

	watchViews(PAGES_SASS, compiler)
	compiler(STYLES_COMMON_SASS, '[sass]: compiling common file')(null)

	gulp.watch(
		[COMPONENTS_SASS],
		gulp.series(
			compiler(STYLES_COMMON_SASS, '[sass]: compiling common file'),
			compiler(PAGES_SASS)
		)
	)

	gulp.watch(
		[STYLES_SASS],
		compiler(STYLES_COMMON_SASS, '[sass]: compiling common file')
	)
})
