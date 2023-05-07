import gulp from 'gulp'
import jade from 'gulp-pug'
import rename from 'gulp-rename'
import browser from 'browser-sync'
import plumber from 'gulp-plumber'
import prettyHtml from 'gulp-html-prettify'
import { Compiler } from '../../types'

const renameSettigns = { dirname: '' }
const prettySettings = { indent_char: ' ', indent_size: 2 }

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
    .pipe(jade())
    .pipe(prettyHtml(prettySettings))
    .pipe(rename(renameSettigns))
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
  return gulp
    .src(input)
    .pipe(plumber())
    .pipe(jade())
    .pipe(rename(renameSettigns))
    .pipe(gulp.dest(output))
    .pipe(browser.stream())
}
