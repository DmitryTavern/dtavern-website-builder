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
import webp from 'gulp-webp'
import image from 'gulp-image'
import server from 'browser-sync'
import plumber from 'gulp-plumber'

/**
 * Key function for processing images.
 *
 * @param input glob of the gulp src
 * @param output directory for output artifacts
 * @returns gulp TaskFunction
 */
const pngCompiler: Compiler = (input, output) => () => {
  if (isDevelopment())
    return gulp
      .src(input)
      .pipe(plumber())
      .pipe(gulp.dest(output))
      .pipe(server.reload({ stream: true }))

  if (isProduction())
    return gulp
      .src(input)
      .pipe(
        image({
          svgo: false,
        })
      )
      .pipe(gulp.dest(output))
}

/**
 * Key function for processing images (webp).
 *
 * @param input glob of the gulp src
 * @param output directory for output artifacts
 * @returns gulp TaskFunction
 */
const webpCompiler: Compiler = (input, output) => () => {
  if (isDevelopment())
    return gulp
      .src(input)
      .pipe(plumber())
      .pipe(webp())
      .pipe(gulp.dest(output))
      .pipe(server.reload({ stream: true }))

  if (isProduction())
    return gulp
      .src(input)
      .pipe(
        webp({
          quality: 60,
        })
      )
      .pipe(gulp.dest(output))
}

/**
 * Function for html processing.
 *
 * @param done gulp TaskFunctionCallback
 */
export const images: TaskFunction = function images(
  done: TaskFunctionCallback
) {
  const env = environment()

  const imagesSourceDir = path.join(
    env.root,
    env.sourceDir,
    env.images.sourceDir
  )

  const imagesOutputDir = path.join(
    env.root,
    env.outputDir,
    env.images.outputDir
  )

  const pngGlob = path.join(imagesSourceDir, '**', '*.*')
  const webpGlob = path.join(imagesSourceDir, '**', '*.+(png|jpg|jpeg)')

  const _pngCompiler = pngCompiler(pngGlob, imagesOutputDir)
  const _webpCompiler = webpCompiler(webpGlob, imagesOutputDir)

  if (isDevelopment()) {
    gulp.watch(pngGlob, _pngCompiler)
    gulp.watch(webpGlob, _webpCompiler)
    return
  }

  if (isProduction()) {
    gulp.series(_pngCompiler, _webpCompiler)(done)
    return
  }
}
