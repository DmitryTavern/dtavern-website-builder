import gulp from 'gulp'
import server from 'browser-sync'
import plumber from 'gulp-plumber'
import { Compiler } from '../../types'

/**
 *
 * @param input
 * @param output
 * @param config
 */
export const compiler: Compiler = (input, output) => () => {
  return gulp.src(input).pipe(gulp.dest(output))
}

/**
 *
 * @param input
 * @param output
 * @param config
 */
export const devCompiler: Compiler = (input, output) => () => {
  return gulp
    .src(input)
    .pipe(plumber())
    .pipe(gulp.dest(output))
    .pipe(server.reload({ stream: true }))
}
