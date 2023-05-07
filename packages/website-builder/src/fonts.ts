/**
 * Types
 */
import { Compiler } from '../types'
import { TaskFunction, TaskFunctionCallback } from 'gulp'

/**
 * Utilities
 */
import path from 'path'
import { environment } from '@shared/environment'
import { isDevelopment, isProduction } from '@shared/mode'

/**
 * Gulp
 */
import gulp from 'gulp'
import server from 'browser-sync'
import plumber from 'gulp-plumber'

/**
 * Key function for processing fonts.
 *
 * @param input glob of the gulp src
 * @param output directory for output artifacts
 * @returns gulp TaskFunction
 */
const compiler: Compiler = (input, output) => () => {
  if (isDevelopment())
    return gulp
      .src(input)
      .pipe(plumber())
      .pipe(gulp.dest(output))
      .pipe(server.reload({ stream: true }))

  if (isProduction()) return gulp.src(input).pipe(gulp.dest(output))
}

/**
 * Function for fonts processing.
 *
 * @param done gulp TaskFunctionCallback
 */
export const fonts: TaskFunction = function fonts(done: TaskFunctionCallback) {
  const env = environment()

  const fontsSourceDir = path.join(env.root, env.sourceDir, env.fonts.sourceDir)
  const fontsOutputDir = path.join(env.root, env.outputDir, env.fonts.outputDir)

  const fontsGlob = path.join(fontsSourceDir, '**', '*.*')

  const fontsCompiler = compiler(fontsGlob, fontsOutputDir)

  if (isDevelopment()) {
    gulp.watch(fontsGlob, fontsCompiler)
    return
  }

  if (isProduction()) {
    gulp.series(fontsCompiler)(done)
    return
  }
}
