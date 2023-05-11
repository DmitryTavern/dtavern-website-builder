import gulp from 'gulp'
import bsync from 'browser-sync'
import { env } from '@shared/environment'
import { resolveApp } from '@shared/resolveApp'

/**
 * Caching the browserSync instance.
 */
let browserSync: bsync.BrowserSyncInstance | undefined

/**
 *
 */
gulp.task('server', (done) => {
  if (!browserSync) browserSync = bsync.create()

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
})
