import path from 'path'
import gulp from 'gulp'

/**
 *
 */
interface ViewsWatcherCallback {
  (pageName: string, pagePath: string): gulp.TaskFunction
}

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
  callback: ViewsWatcherCallback
) => {
  gulp
    .watch(glob, {
      ignoreInitial: false,
      ignored: /(^|[\/\\])\../,
      depth: 0,
    })
    .on('add', (pagefile: string) => {
      const pagename = getBasename(pagefile)

      watchers[pagename] = gulp.watch(
        pagefile,
        { ignoreInitial: true },
        callback(pagename, pagefile)
      )
    })
    .on('unlink', (pagefile: string) => {
      const pagename = getBasename(pagefile)

      if (watchers[pagename]) {
        watchers[pagename].close()
        delete watchers[pagename]
      }
    })
}
