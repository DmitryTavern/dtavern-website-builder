import gulp, { TaskFunction } from 'gulp'

/**
 *
 * @param glob
 * @param callback
 */
export const watcher = (glob: string | string[], callback: TaskFunction) => {
  gulp.watch(glob, { ignoreInitial: false }, callback)
}
