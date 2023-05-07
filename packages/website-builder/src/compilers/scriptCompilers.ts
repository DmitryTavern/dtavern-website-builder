import path from 'path'
import glob from 'glob'
import gulp from 'gulp'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'
import server from 'browser-sync'
import { Compiler } from '../../types'
import { genConfig, genDevConfig, createBundle } from './rollupCompilers'

const renameSettigns = { dirname: '' }

/**
 *
 *
 * @param input
 * @param output
 * @returns
 */
export const compiler: Compiler = (input, output) => () => {
  const files = glob.sync(input)

  for (const file of files) {
    const filename = path.basename(file).replace('.js', '.min.js')
    const config = genConfig(output, filename)
    createBundle(file, output, config)
  }

  return gulp.src(input)
}

/**
 *
 *
 * @param input
 * @param output
 * @returns
 */
export const devCompiler: Compiler = (input, output) => () => {
  const files = glob.sync(input)

  for (const file of files) {
    const filename = path.basename(file)
    const config = genDevConfig(output, filename)
    createBundle(file, output, config)
  }

  return gulp.src(input).pipe(server.reload({ stream: true }))
}

/**
 *
 *
 * @param input
 * @param output
 * @returns
 */
export const vendorCompiler: Compiler = (input, output) => () => {
  const renameSettigns = { dirname: '' }

  return gulp
    .src(input)
    .pipe(uglify())
    .pipe(rename(renameSettigns))
    .pipe(gulp.dest(output))
}

/**
 *
 *
 * @param input
 * @param output
 * @returns
 */
export const devVendorCompiler: Compiler = (input, output) => () => {
  return gulp
    .src(input)
    .pipe(rename(renameSettigns))
    .pipe(gulp.dest(output))
    .pipe(server.reload({ stream: true }))
}
