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
import jade from 'gulp-pug'
import rename from 'gulp-rename'
import browser from 'browser-sync'
import plumber from 'gulp-plumber'
import prettyHtml from 'gulp-html-prettify'

/**
 * Key function for converting pug files to html.
 *
 * @param input glob of the gulp src
 * @param output directory for output artifacts
 * @returns gulp TaskFunction
 */
const compiler: Compiler = (input, output) => () => {
  const renameSettigns = { dirname: '' }
  const prettySettings = { indent_char: ' ', indent_size: 2 }

  if (isDevelopment())
    return gulp
      .src(input)
      .pipe(plumber())
      .pipe(jade())
      .pipe(rename(renameSettigns))
      .pipe(gulp.dest(output))
      .pipe(browser.stream())

  if (isProduction())
    return gulp
      .src(input)
      .pipe(jade())
      .pipe(prettyHtml(prettySettings))
      .pipe(rename(renameSettigns))
      .pipe(gulp.dest(output))
}

/**
 * Function for html processing.
 *
 * @param done gulp TaskFunctionCallback
 */
export const html: TaskFunction = function html(done: TaskFunctionCallback) {
  const env = environment()

  const viewsSourceDir = path.join(env.root, env.sourceDir, env.html.sourceDir)
  const viewsOutputDir = path.join(env.root, env.outputDir, env.html.outputDir)

  const viewsGlob = path.join(viewsSourceDir, '**', '*.pug')
  const viewsPagesGlob = path.join(viewsSourceDir, '*.pug')

  const pagesCompiler = compiler(viewsPagesGlob, viewsOutputDir)

  if (isDevelopment()) {
    // Compile all pages if changes are detected in a pug file
    // that is not a page.
    gulp.watch([viewsGlob, `!${viewsPagesGlob}`], pagesCompiler)

    // Compile all pages if changes are detected in any page.
    gulp.watch(viewsPagesGlob, pagesCompiler)

    return
  }

  if (isProduction()) {
    // Compile all pages.
    gulp.series(pagesCompiler)(done)
    return
  }
}
