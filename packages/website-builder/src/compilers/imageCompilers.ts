import gulp from 'gulp'
import webp from 'gulp-webp'
import image from 'gulp-image'
import server from 'browser-sync'
import plumber from 'gulp-plumber'
import { Compiler } from '../../types'

/**
 *
 *
 * @param input
 * @param output
 * @returns
 */
export const compiler: Compiler = (input, output) => () => {
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
 *
 *
 * @param input
 * @param output
 * @returns
 */
export const devCompiler: Compiler = (input, output) => () => {
  return gulp
    .src(input)
    .pipe(plumber())
    .pipe(gulp.dest(output))
    .pipe(server.reload({ stream: true }))
}

/**
 *
 *
 * @param input
 * @param output
 * @returns
 */
export const webpCompiler: Compiler = (input, output) => () => {
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
 *
 *
 * @param input
 * @param output
 * @returns
 */
export const devWebpCompiler: Compiler = (input, output) => () => {
  return gulp
    .src(input)
    .pipe(plumber())
    .pipe(webp())
    .pipe(gulp.dest(output))
    .pipe(server.reload({ stream: true }))
}
