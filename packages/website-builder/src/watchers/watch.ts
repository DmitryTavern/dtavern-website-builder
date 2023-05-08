import gulp, { TaskFunction } from 'gulp'

/**
 *
 * @param glob
 * @param callback
 */
export const watch = (glob: gulp.Globs, callback: TaskFunction) => {
  gulp.watch(glob, { ignoreInitial: false }, callback)
}
