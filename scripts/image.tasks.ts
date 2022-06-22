import * as path from 'path'
import * as gulp from 'gulp'
import * as server from 'browser-sync'
import * as webp from 'gulp-webp'
import * as image from 'gulp-image'
import * as plumber from 'gulp-plumber'
import * as notify from 'gulp-notify'
import * as types from '../types'

import { __, isDev, isProd, setDisplayName } from '@utilities'

const {
	APP_ASSETS_IMAGES_DIR,
	APP_ASSETD_FAVICON_DIR,
	APP_BUILD_FAVICON_DIRNAME,
	APP_BUILD_DIRNAME,
	APP_BUILD_IMAGES_DIRNAME,
} = process.env

const IMAGES_FILES = path.join(APP_ASSETS_IMAGES_DIR, '/**/*.*')
const IMAGES_FAVICON = path.join(APP_ASSETD_FAVICON_DIR, '**.*')
const IMAGES_WEBP_FILES = path.join(
	APP_ASSETS_IMAGES_DIR,
	'/**/*.+(png|jpg|jpeg)'
)

const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_IMAGES_DIRNAME)
const BUILD_FAVICON_DIR = path.join(
	APP_BUILD_DIRNAME,
	APP_BUILD_FAVICON_DIRNAME
)

const SRC_IMAGES = [IMAGES_FILES, `!${IMAGES_FAVICON}`]
const SRC_IMAGES_WEBP = [IMAGES_WEBP_FILES, `!${IMAGES_FAVICON}`]
const SRC_IMAGES_FAVICON = [IMAGES_FAVICON]

const imagesCompiler: types.Compiler = (input: string | string[]) => () => {
	if (isDev())
		return gulp
			.src(input)
			.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
			.pipe(gulp.dest(BUILD_DIR))
			.pipe(server.reload({ stream: true }))

	if (isProd())
		return gulp
			.src(input)
			.pipe(
				image({
					svgo: false,
				})
			)
			.pipe(gulp.dest(BUILD_DIR))
}

const webpCompiler: types.Compiler = (input: string | string[]) => () => {
	if (isDev())
		return gulp
			.src(input)
			.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
			.pipe(webp())
			.pipe(gulp.dest(BUILD_DIR))
			.pipe(server.reload({ stream: true }))

	if (isProd())
		return gulp
			.src(input)
			.pipe(
				webp({
					quality: 60,
				})
			)
			.pipe(gulp.dest(BUILD_DIR))
}

const faviconCompiler: types.Compiler = (input: string | string[]) => () => {
	if (isDev())
		return gulp
			.src(input)
			.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
			.pipe(gulp.dest(BUILD_FAVICON_DIR))
			.pipe(server.reload({ stream: true }))

	if (isProd()) return gulp.src(input).pipe(gulp.dest(BUILD_FAVICON_DIR))
}

const taskName = __('TASK_IMAGES')
const taskCompilerImages = __('TASK_COMPILER_IMAGES')
const taskCompilerWebp = __('TASK_COMPILER_IMAGES_WEBP')
const taskCompilerFavicon = __('TASK_COMPILER_IMAGES_FAVICON')

export default setDisplayName(taskName, (done: any) => {
	const fn = setDisplayName(taskCompilerImages, imagesCompiler(SRC_IMAGES))
	const fnWebp = setDisplayName(taskCompilerWebp, webpCompiler(SRC_IMAGES_WEBP))
	const fnFavicon = setDisplayName(
		taskCompilerFavicon,
		faviconCompiler(SRC_IMAGES_FAVICON)
	)

	if (isProd()) {
		gulp.series(fn, fnWebp, fnFavicon)(done)
		return
	}

	gulp.watch(
		SRC_IMAGES,
		{
			ignoreInitial: false,
		},
		fn
	)

	gulp.watch(
		SRC_IMAGES_WEBP,
		{
			ignoreInitial: false,
		},
		fnWebp
	)

	gulp.watch(
		SRC_IMAGES_FAVICON,
		{
			ignoreInitial: false,
		},
		fnFavicon
	)
})
