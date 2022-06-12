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

import watchViews from './helpers/watchViews'
import watchComponents from './helpers/watchComponents'
import { setDisplayName } from './helpers/setDisplayName'
import { isDev, isProd } from './helpers/mode'
import { mkdir } from './helpers/mkdir'
import { __ } from './helpers/logger'

const {
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
	try {
		const files = glob.sync(input)

		for (const file of files) {
			const name = path.basename(file)

			const outputsList: any[] = [
				{
					file: path.join(BUILD_DIR, name),
					format: 'cjs',
				},
			]

			if (isProd()) {
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
	} catch (e) {
		console.error(e)
	}
}

const compiler: types.Compiler = (input: string) => () => {
	rollupCompiler(input)

	if (isDev()) return gulp.src(input).pipe(server.reload({ stream: true }))
	if (isProd()) return gulp.src(input)
}

const vendorCompiler: types.Compiler = (input: string) => () => {
	if (isDev())
		return gulp
			.src(input)
			.pipe(rename({ dirname: '' }))
			.pipe(gulp.dest(BUILD_VENDOR_DIR))
			.pipe(server.reload({ stream: true }))

	if (isProd())
		return gulp
			.src(input)
			.pipe(uglify())
			.pipe(rename({ dirname: '' }))
			.pipe(gulp.dest(BUILD_VENDOR_DIR))
}

const taskName = __('TASK_SCRIPT')
const taskCompilerPages = __('TASK_COMPILER_SCRIPT_PAGES')
const taskCompilerGlobal = __('TASK_COMPILER_SCRIPT_GLOBAL')
const taskCompilerVendor = __('TASK_COMPILER_SCRIPT_VENDOR')

export default setDisplayName(taskName, (done: any) => {
	const fn = setDisplayName(taskCompilerGlobal, compiler(SCRIPTS_COMMON_JS))
	const fnPages = setDisplayName(taskCompilerPages, compiler(PAGES_JS))
	const fnVendor = setDisplayName(
		taskCompilerVendor,
		vendorCompiler(SCRIPTS_VENDOR_JS)
	)

	if (isProd()) {
		gulp.series(fnVendor, fnPages, fn)(done)
		return
	}

	watchViews(APP_PAGES_SCRIPTS_DIR, compiler)

	watchComponents(COMPONENTS_JS, {
		global: fnPages,
		page: compiler,
	})

	gulp.watch(
		[SCRIPTS_JS, `!${SCRIPTS_VENDOR_JS}`],
		{
			ignoreInitial: false,
		},
		fn
	)

	gulp.watch(
		SCRIPTS_VENDOR_JS,
		{
			ignoreInitial: false,
		},
		fnVendor
	)
})
