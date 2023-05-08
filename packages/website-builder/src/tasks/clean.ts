import fs from 'fs'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { resolveApp } from '@shared/resolveApp'

/**
 *
 */
export const clean: gulp.TaskFunction = (done) => {
  const outputDir = resolveApp(env.outputDir)

  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, {
      force: true,
      recursive: true,
    })
  }

  done()
}
