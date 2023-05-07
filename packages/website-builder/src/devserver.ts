import path from 'path'
import server from 'browser-sync'
import { environment } from '@shared/environment'
import { resolveOutput } from '@shared/resolveOutput'
import { TaskFunction, TaskFunctionCallback } from 'gulp'
import { isDevelopment, isProduction } from '@shared/mode'

/**
 * Caching the browserSync instance.
 */
let browserSync: server.BrowserSyncInstance | undefined = isDevelopment()
  ? server.create()
  : undefined

/**
 * Function for starting dev server.
 * @param done gulp TaskFunctionCallback
 */
export const devserver: TaskFunction = function devserver(
  done: TaskFunctionCallback
) {
  if (isProduction()) return done()

  const env = environment()
  const outputDir = resolveOutput('./')

  if (browserSync) {
    browserSync.init({
      ...env.devserver,
      server: {
        ...(typeof env.devserver.server === 'object'
          ? env.devserver.server
          : {}),
        baseDir: outputDir,
      },
    })

    browserSync.watch(outputDir).on('change', browserSync.reload)

    done()
  }
}
