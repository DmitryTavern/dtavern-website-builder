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
 * Key function for processing favicon.
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
 * Function for favicon processing.
 *
 * @param done gulp TaskFunctionCallback
 */
export const favicon: TaskFunction = function favicon(
  done: TaskFunctionCallback
) {
  const env = environment()

  const faviconSourceDir = path.join(
    env.root,
    env.sourceDir,
    env.favicon.sourceDir
  )

  const faviconOutputDir = path.join(
    env.root,
    env.outputDir,
    env.favicon.outputDir
  )

  const faviconGlob = path.join(faviconSourceDir, '**', '*.*')

  const faviconCompiler = compiler(faviconGlob, faviconOutputDir)

  if (isDevelopment()) {
    gulp.watch(faviconGlob, faviconCompiler)
    return
  }

  if (isProduction()) {
    gulp.series(faviconCompiler)(done)
    return
  }
}
