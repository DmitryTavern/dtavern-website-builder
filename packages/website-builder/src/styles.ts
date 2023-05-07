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
import sass from 'sass'
import gsass from 'gulp-sass'
import rename from 'gulp-rename'
import server from 'browser-sync'
import cssnano from 'gulp-cssnano'
import plumber from 'gulp-plumber'
import autoprefixer from 'gulp-autoprefixer'
import gcmq from 'gulp-group-css-media-queries'

const sassGulp = gsass(sass)

/**
 * Key function for converting scss files to css.
 *
 * @param input glob of the gulp src
 * @param output directory for output artifacts
 * @returns gulp TaskFunction
 */
const compiler: Compiler = (input, output) => () => {
  const renameSettigns = { dirname: '' }

  if (isDevelopment())
    return gulp
      .src(input)
      .pipe(plumber())
      .pipe(sassGulp())
      .pipe(gcmq())
      .pipe(rename(renameSettigns))
      .pipe(gulp.dest(output))
      .pipe(server.stream())

  if (isProduction())
    return gulp
      .src(input)
      .pipe(sassGulp().on('error', sassGulp.logError))
      .pipe(
        autoprefixer({
          cascade: false,
        })
      )
      .pipe(gcmq())
      .pipe(rename(renameSettigns))
      .pipe(gulp.dest(output))
      .pipe(rename({ suffix: '.min' }))
      .pipe(cssnano())
      .pipe(gulp.dest(output))
}

/**
 * Function for styles processing.
 *
 * @param done gulp TaskFunctionCallback
 */
export const styles: TaskFunction = function styles(
  done: TaskFunctionCallback
) {
  const env = environment()

  const sourceDir = path.join(env.root, env.sourceDir, env.styles.sourceDir)
  const sourcePagesDir = path.join(
    env.root,
    env.sourceDir,
    env.styles.sourcePagesDir
  )

  const outputDir = path.join(env.root, env.outputDir, env.styles.outputDir)
  const outputPagesDir = path.join(
    env.root,
    env.outputDir,
    env.styles.outputPagesDir
  )

  const stylesGlob = path.join(sourceDir, '**', '*.scss')
  const stylesPagesGlob = path.join(sourcePagesDir, '**', '*.scss')

  const stylesCompiler = compiler(stylesGlob, outputDir)
  const stylesPageCompiler = compiler(stylesPagesGlob, outputPagesDir)

  if (isDevelopment()) {
    // Compile all styles if changes are detected in a scss file
    // that is not a page.
    gulp.watch([stylesGlob, `!${stylesPagesGlob}`], stylesCompiler)

    // Compile all styles if changes are detected in any page style.
    gulp.watch([stylesPagesGlob, `!${stylesGlob}`], stylesPageCompiler)

    return
  }

  if (isProduction()) {
    // Compile all styles.
    gulp.series(stylesCompiler, stylesPageCompiler)(done)
    return
  }
}
