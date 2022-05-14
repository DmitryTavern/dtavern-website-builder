import * as path from 'path'
import * as gulp from 'gulp'
import * as server from 'browser-sync'
import * as svgSprite from 'gulp-svg-sprite'
import * as types from './types'

import taskWrap from './helpers/taskWrap'
import compilerWrap from './helpers/compilerWrap'

const {
	NODE_ENV,
	APP_ASSETS_SPRITE_DIR,
	APP_BUILD_DIRNAME,
	APP_BUILD_IMAGES_DIRNAME,
	APP_SPRITE_FILENAME,
} = process.env

const SPRITE_ICONS = path.join(APP_ASSETS_SPRITE_DIR, '/*.svg')
const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_IMAGES_DIRNAME)

const compiler: types.Compiler = (input: string) =>
	compilerWrap('[svg]: compiling all icons', () => {
		return gulp
			.src(SPRITE_ICONS)
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
	})

export default taskWrap('[task]: run sprite service', (done: any) => {
	if (NODE_ENV === 'production') {
		compiler(done)
		return
	}

	gulp.watch(
		SPRITE_ICONS,
		{
			ignoreInitial: false,
		},
		compiler()
	)
}
)