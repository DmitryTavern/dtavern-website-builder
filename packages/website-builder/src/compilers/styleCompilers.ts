import gulp from 'gulp'
import sass from 'sass'
import gsass from 'gulp-sass'
import rename from 'gulp-rename'
import server from 'browser-sync'
import cssnano from 'gulp-clean-css'
import plumber from 'gulp-plumber'
import autoprefixer from 'gulp-autoprefixer'
import gcmq from 'gulp-group-css-media-queries'
import { Compiler } from '../../types'

const sassGulp = gsass(sass)
const renameSettigns = { dirname: '' }

/**
 *
 *
 * @param input
 * @param output
 * @returns gulp TaskFunction
 */
export const compiler: Compiler = (input, output) => () => {
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
 *
 *
 * @param input
 * @param output
 * @returns gulp TaskFunction
 */
export const devCompiler: Compiler = (input, output) => () => {
  const renameSettigns = { dirname: '' }

  return gulp
    .src(input)
    .pipe(plumber())
    .pipe(sassGulp().on('error', sassGulp.logError))
    .pipe(gcmq())
    .pipe(rename(renameSettigns))
    .pipe(gulp.dest(output))
    .pipe(server.stream())
}
