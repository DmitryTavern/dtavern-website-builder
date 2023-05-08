import gulp from 'gulp'
import bsserver from 'browser-sync'
import { env } from '@shared/environment'
import { resolveApp } from '@shared/resolveApp'

/**
 * Caching the browserSync instance.
 */
let browserSync: bsserver.BrowserSyncInstance | undefined

/**
 *
 */
export const server: gulp.TaskFunction = (done) => {
  if (!browserSync) browserSync = bsserver.create()

  const outputDir = resolveApp(env.outputDir)

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
