import * as fs from 'fs'
import * as path from 'path'
import * as gulp from 'gulp'
import * as glob from 'glob'
import * as rollup from 'rollup'
import * as terser from 'rollup-plugin-terser'
import * as server from 'browser-sync'
import * as uglify from 'gulp-uglify'
import * as rename from 'gulp-rename'
import * as types from './types'

import taskWrap from './helpers/taskWrap'
import compilerWrap from './helpers/compilerWrap'
import watchViews from './helpers/watchViews'
import watchComponents from './helpers/watchComponents'
import { mkdir } from './helpers/mkdir'

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

const PAGES_JS = path.join(APP_PAGES_SCRIPTS_DIR, '/*.js')
const COMPONENTS_JS = path.join(APP_COMPONENTS_DIR, '/**/*.js')

const BUILD_DIR = path.join(APP_BUILD_DIRNAME, APP_BUILD_SCRIPTS_DIRNAME)
const BUILD_VENDOR_DIR = path.join(
	APP_BUILD_DIRNAME,
	APP_BUILD_SCRIPTS_VENDOR_DIRNAME
)

const rollupCompiler = async (input: string) => {
	const files = glob.sync(input)

	for (const file of files) {
		const name = path.basename(file)

		const outputsList: any[] = [
			{
				file: path.join(BUILD_DIR, name),
				format: 'cjs',
			},
		]

		if (NODE_ENV === 'production') {
			outputsList.push({
				file: path.join(BUILD_DIR, name.replace('.js', '.min.js')),
				plugins: [terser.terser()],
				format: 'cjs',
			})
		}

		const bundle = await rollup.rollup({ input: file })

		for (const options of outputsList) {
			const { output } = await bundle.generate(options)

			for (const chunk of output) {
				if (chunk.type === 'chunk') {
					mkdir(BUILD_DIR)
					fs.writeFileSync(path.join(BUILD_DIR, chunk.fileName), chunk.code)
				}
			}
		}
	}
}

const compiler: types.Compiler = (input: string, msg: string) =>
	compilerWrap(msg ? msg : '[js]: compiling all pages', async () => {
		if (NODE_ENV === 'development') {
			rollupCompiler(input)
			return gulp.src(input).pipe(server.reload({ stream: true }))
		}

		if (NODE_ENV === 'production') {
			rollupCompiler(input)
			return gulp.src(input)
		}
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
				.pipe(uglify())
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

	watchViews(APP_PAGES_SCRIPTS_DIR, compiler)

	gulp.series(compiler(SCRIPTS_COMMON_JS, '[js]: compiling common file'))(null)

	watchComponents(COMPONENTS_JS, {
		global: gulp.series(
			compiler(SCRIPTS_COMMON_JS, '[js]: compiling common file')
		),
		page: compiler,
	})

	gulp.watch(
		[SCRIPTS_JS, `!${SCRIPTS_VENDOR_JS}`],
		gulp.series(compiler(SCRIPTS_COMMON_JS, '[js]: compiling common file'))
	)

	gulp.watch(
		SCRIPTS_VENDOR_JS,
		{
			ignoreInitial: false,
		},
		vendorCompiler()
	)
})
