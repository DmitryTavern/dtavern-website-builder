import gulp from 'gulp'
import bsserver from 'browser-sync'
import { env } from '@shared/environment'
import { resolveOutput } from '@shared/resolveOutput'

/**
 * Caching the browserSync instance.
 */
let browserSync: bsserver.BrowserSyncInstance | undefined

/**
 * Function for starting dev server.
 * @param done gulp TaskFunctionCallback
 */
export const server: gulp.TaskFunction = function server(done) {
  if (!browserSync) browserSync = bsserver.create()

  const outputDir = resolveOutput('./')

  browserSync.init({
    ...env.devserver,
    server: {
      ...(typeof env.devserver.server === 'object' ? env.devserver.server : {}),
      baseDir: outputDir,
    },
  })

  browserSync.watch(outputDir).on('change', browserSync.reload)

  done()
}
