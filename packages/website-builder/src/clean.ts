import fs from 'fs'
import gulp from 'gulp'
import { resolveOutput } from '@shared/resolveOutput'

/**
 *
 * @param done
 */
export const clean: gulp.TaskFunction = function clean(done) {
  const outputDir = resolveOutput('./')

  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, {
      force: true,
      recursive: true,
    })
  }

  done()
}
