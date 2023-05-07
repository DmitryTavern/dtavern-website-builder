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
import svgSprite from 'gulp-svg-sprite'

/**
 * Key function for processing sprite.
 *
 * @param input glob of the gulp src
 * @param output directory for output artifacts
 * @returns gulp TaskFunction
 */
const compiler: Compiler = (input, output) => () => {
  const env = environment()

  return gulp
    .src(input)
    .pipe(plumber())
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: path.join('..', env.sprite.filename),
          },
        },
      })
    )
    .pipe(gulp.dest(output))
    .pipe(server.reload({ stream: true }))
}

/**
 * Function for sprite processing.
 *
 * @param done gulp TaskFunctionCallback
 */
export const sprite: TaskFunction = function sprite(
  done: TaskFunctionCallback
) {
  const env = environment()

  const spriteSourceDir = path.join(
    env.root,
    env.sourceDir,
    env.sprite.sourceDir
  )

  const spriteOutputDir = path.join(
    env.root,
    env.outputDir,
    env.sprite.outputDir
  )

  const spriteGlob = path.join(spriteSourceDir, '*.svg')

  const spriteCompiler = compiler(spriteGlob, spriteOutputDir)

  if (isDevelopment()) {
    gulp.watch(spriteGlob, spriteCompiler)
    return
  }

  if (isProduction()) {
    gulp.series(spriteCompiler)(done)
    return
  }
}
