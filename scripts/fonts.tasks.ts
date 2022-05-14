import * as path from 'path'
import * as gulp from 'gulp'
import * as server from 'browser-sync'
import * as types from './types'

import taskWrap from './helpers/taskWrap'
import compilerWrap from './helpers/compilerWrap'

const {
	NODE_ENV,
	APP_BUILD_DIRNAME,
	APP_ASSETS_FONTS_DIR,
	APP_BUILD_FONTS_DIRNAME,
} = process.env

const FONTS_FILES = path.join(APP_ASSETS_FONTS_DIR, '/**/*.*')
const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_FONTS_DIRNAME)

const compiler: types.Compiler = (input: string) =>
	compilerWrap('[font]: move all files', () => {
		if (NODE_ENV === 'development')
			return gulp
				.src(FONTS_FILES)
				.pipe(gulp.dest(BUILD_DIR))
				.pipe(server.reload({ stream: true }))
		if (NODE_ENV === 'production')
			return gulp.src(FONTS_FILES).pipe(gulp.dest(BUILD_DIR))
	})

export default taskWrap('[task]: run fonts service', (done: any) => {
	if (NODE_ENV === 'production') {
		compiler(done)
		return
	}

	gulp.watch(
		FONTS_FILES,
		{
			ignoreInitial: false,
		},
		compiler()
	)
})
