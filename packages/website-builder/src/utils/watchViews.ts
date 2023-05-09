import path from 'path'
import gulp from 'gulp'
import { Compiler } from '../../types'

/**
 *
 */
const watchers = {}

/**
 *
 * @param str
 * @returns
 */
const getBasename = (str: string) => {
  return path.basename(str).replace(/\..*$/, '')
}

/**
 *
 */
export const watchViews = (
  glob: gulp.Globs,
  output: string,
  compiler: Compiler
) => {
  gulp
    .watch(glob, {
      ignoreInitial: false,
      ignored: /(^|[\/\\])\../,
      depth: 0,
    })
    .on('add', (pagefile: string) => {
      const pagename = getBasename(pagefile)
      const fn = compiler(pagefile, output)

      fn.displayName = path.basename(pagefile)

      watchers[pagename] = gulp.watch(pagefile, fn)
    })
    .on('unlink', (pagefile: string) => {
      const pagename = getBasename(pagefile)

      if (watchers[pagename]) {
        watchers[pagename].close()
        delete watchers[pagename]
      }
    })
}
