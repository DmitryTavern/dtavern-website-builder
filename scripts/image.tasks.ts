import * as path from 'path'
import * as gulp from 'gulp'
import * as server from 'browser-sync'
import * as webp from 'gulp-webp'
import * as image from 'gulp-image'
import * as types from './types'

import taskWrap from './helpers/taskWrap'
import compilerWrap from './helpers/compilerWrap'

const {
	NODE_ENV,
	APP_ASSETS_IMAGES_DIR,
	APP_BUILD_DIRNAME,
	APP_BUILD_IMAGES_DIRNAME,
} = process.env

const IMAGES_FILES = path.join(APP_ASSETS_IMAGES_DIR, '/**/*.*')
const IMAGES_FAVICON = path.join(APP_ASSETS_IMAGES_DIR, 'favicon/**.*')
const IMAGES_WEBP_FILES = path.join(
	APP_ASSETS_IMAGES_DIR,
	'/**/*.+(png|jpg|jpeg)'
)
const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_IMAGES_DIRNAME)
const BUILD_FAVICON_DIR = path.join(
	APP_BUILD_DIRNAME,
	APP_BUILD_IMAGES_DIRNAME,
	'favicon'
)

const imagesCompiler: types.Compiler = () =>
	compilerWrap('[img]: compiling all images', () => {
		if (NODE_ENV === 'development')
			return gulp
				.src([IMAGES_FILES, `!${IMAGES_FAVICON}`])
				.pipe(gulp.dest(BUILD_DIR))
				.pipe(server.reload({ stream: true }))

		if (NODE_ENV === 'production')
			return gulp
				.src([IMAGES_FILES, `!${IMAGES_FAVICON}`])
				.pipe(
					image({
						svgo: false,
					})
				)
				.pipe(gulp.dest(BUILD_DIR))
	})

const webpCompiler: types.Compiler = () =>
	compilerWrap('[webp]: compiling all files', () => {
		if (NODE_ENV === 'development')
			return gulp
				.src([IMAGES_WEBP_FILES, `!${IMAGES_FAVICON}`])
				.pipe(webp())
				.pipe(gulp.dest(BUILD_DIR))
				.pipe(server.reload({ stream: true }))

		if (NODE_ENV === 'production')
			return gulp
				.src([IMAGES_WEBP_FILES, `!${IMAGES_FAVICON}`])
				.pipe(
					webp({
						quality: 60,
					})
				)
				.pipe(gulp.dest(BUILD_DIR))
	})

const faviconCompiler: types.Compiler = () =>
	compilerWrap('[favicon]: moving all files', () => {
		if (NODE_ENV === 'development')
			return gulp
				.src(IMAGES_FAVICON)
				.pipe(gulp.dest(BUILD_FAVICON_DIR))
				.pipe(server.reload({ stream: true }))
		if (NODE_ENV === 'production')
			return gulp.src(IMAGES_FAVICON).pipe(gulp.dest(BUILD_FAVICON_DIR))
	})

export default taskWrap('[task]: run images services', (done: any) => {
	if (NODE_ENV === 'production') {
		gulp.series(imagesCompiler(), webpCompiler(), faviconCompiler())(done)
		return
	}

	gulp.watch(
		[IMAGES_FILES, `!${IMAGES_FAVICON}`],
		{
			ignoreInitial: false,
		},
		imagesCompiler()
	)

	gulp.watch(
		[IMAGES_WEBP_FILES, `!${IMAGES_FAVICON}`],
		{
			ignoreInitial: false,
		},
		webpCompiler()
	)

	gulp.watch(
		[IMAGES_FAVICON],
		{
			ignoreInitial: false,
		},
		faviconCompiler()
	)
})
