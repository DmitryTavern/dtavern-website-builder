/**
 * Types
 */
import { Compiler } from '../types'
import { TaskFunction, TaskFunctionCallback } from 'gulp'

/**
 * Utilities
 */
import fs from 'fs'
import path from 'path'
import glob from 'glob'
import { environment } from '@shared/environment'
import { isDevelopment, isProduction } from '@shared/mode'

/**
 * Gulp
 */
import gulp from 'gulp'
import server from 'browser-sync'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'

/**
 * Rollup
 */
import rollup from 'rollup'
import rollupTerser from '@rollup/plugin-terser'

/**
 * Key function for processing js scripts.
 *
 * @param input scripts glob
 * @param output directory for output artifacts
 */
const rollupCompiler = (input: string | string[], output: string) => {
  try {
    const files = glob.sync(input)

    for (const file of files) {
      const filename = path.basename(file)
      const filenameMin = filename.replace('.js', '.min.js')

      const outputsList: any[] = [
        {
          file: path.join(output, filename),
          format: 'cjs',
        },
      ]

      if (isProduction()) {
        outputsList.push({
          file: path.join(output, filenameMin),
          plugins: [rollupTerser()],
          format: 'cjs',
        })
      }

      rollup.rollup({ input: file }).then((bundle) => {
        for (const options of outputsList) {
          bundle.generate(options).then((payload) => {
            for (const chunk of payload.output) {
              if (chunk.type === 'chunk') {
                fs.mkdirSync(output, { recursive: true })
                fs.writeFileSync(path.join(output, chunk.fileName), chunk.code)
              }
            }
          })
        }
      })
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * Key function for processing js scripts.
 *
 * @param input scripts glob
 * @param output directory for output artifacts
 * @returns gulp TaskFunction
 */
const compiler: Compiler = (input, output) => () => {
  rollupCompiler(input, output)

  if (isDevelopment()) {
    return gulp.src(input).pipe(server.reload({ stream: true }))
  }

  if (isProduction()) {
    return gulp.src(input)
  }
}

/**
 * Key function for processing js libraries.
 *
 * @param input glob of the gulp src
 * @param output directory for output artifacts
 * @returns gulp TaskFunction
 */
const vendorCompiler: Compiler = (input, output) => () => {
  const renameSettigns = { dirname: '' }

  if (isDevelopment())
    return gulp
      .src(input)
      .pipe(rename(renameSettigns))
      .pipe(gulp.dest(output))
      .pipe(server.reload({ stream: true }))

  if (isProduction())
    return gulp
      .src(input)
      .pipe(uglify())
      .pipe(rename(renameSettigns))
      .pipe(gulp.dest(output))
}

/**
 * Function for scripts processing.
 *
 * @param done gulp TaskFunctionCallback
 */
export const scripts: TaskFunction = function scripts(
  done: TaskFunctionCallback
) {
  const env = environment()

  const sourceDir = path.join(env.root, env.sourceDir, env.scripts.sourceDir)
  const sourcePagesDir = path.join(
    env.root,
    env.sourceDir,
    env.scripts.sourcePagesDir
  )
  const sourceVendorDir = path.join(
    env.root,
    env.sourceDir,
    env.scripts.sourceVendorDir
  )

  const outputDir = path.join(env.root, env.outputDir, env.scripts.outputDir)
  const outputPagesDir = path.join(
    env.root,
    env.outputDir,
    env.scripts.outputPagesDir
  )
  const outputVendorDir = path.join(
    env.root,
    env.outputDir,
    env.scripts.outputVendorDir
  )

  const scriptsGlob = path.join(sourceDir, '*.js')
  const scriptsPagesGlob = path.join(sourcePagesDir, '*.js')
  const scriptsVendorGlob = path.join(sourceVendorDir, '*.js')

  const scriptsCompilerGlob = [
    scriptsGlob,
    `!${scriptsPagesGlob}`,
    `!${scriptsVendorGlob}`,
  ]

  const scriptsPageCompilerGlob = [
    `!${scriptsGlob}`,
    scriptsPagesGlob,
    `!${scriptsVendorGlob}`,
  ]

  const scriptsVendorCompilerGlob = [
    `!${scriptsGlob}`,
    scriptsVendorGlob,
    `!${scriptsPagesGlob}`,
  ]

  const scriptsCompiler = compiler(scriptsCompilerGlob, outputDir)
  const scriptsPageCompiler = compiler(scriptsPageCompilerGlob, outputPagesDir)
  const scriptsVendorCompiler = vendorCompiler(
    scriptsVendorCompilerGlob,
    outputVendorDir
  )

  if (isDevelopment()) {
    gulp.watch(scriptsCompilerGlob, scriptsCompiler)
    gulp.watch(scriptsPageCompilerGlob, scriptsPageCompiler)
    gulp.watch(scriptsVendorCompilerGlob, scriptsVendorCompiler)
    return
  }

  if (isProduction()) {
    gulp.series(
      scriptsCompiler,
      scriptsPageCompiler,
      scriptsVendorCompiler
    )(done)
    return
  }
}
