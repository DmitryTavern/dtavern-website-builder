import path from 'path'
import gulp from 'gulp'
import { watcher } from './watchers/watcher'
import { environment } from '@shared/environment'
import { compiler, devCompiler } from './compilers/styleCompilers'
import { isDevelopment, isProduction } from '@shared/mode'
import { TaskFunction, TaskFunctionCallback } from 'gulp'

/**
 * Function for styles processing.
 * @param done gulp TaskFunctionCallback
 */
export const styles: TaskFunction = function styles(
  done: TaskFunctionCallback
) {
  const env = environment()

  const sourceDir = path.join(env.root, env.sourceDir, env.styles.sourceDir)
  const sourcePagesDir = path.join(
    env.root,
    env.sourceDir,
    env.styles.sourcePagesDir
  )

  const outputDir = path.join(env.root, env.outputDir, env.styles.outputDir)
  const outputPagesDir = path.join(
    env.root,
    env.outputDir,
    env.styles.outputPagesDir
  )

  const stylesGlob = path.join(sourceDir, '**', '*.scss')
  const stylesPagesGlob = path.join(sourcePagesDir, '**', '*.scss')

  if (isProduction()) {
    const stylesCompiler = compiler(stylesGlob, outputDir)
    const stylesPageCompiler = compiler(stylesPagesGlob, outputPagesDir)

    gulp.series(stylesCompiler, stylesPageCompiler)(done)
    return
  }

  if (isDevelopment()) {
    const stylesCompiler = devCompiler(stylesGlob, outputDir)
    const stylesPageCompiler = devCompiler(stylesPagesGlob, outputPagesDir)

    watcher([stylesGlob, `!${stylesPagesGlob}`], stylesCompiler)
    watcher([stylesPagesGlob, `!${stylesGlob}`], stylesPageCompiler)
    return
  }
}
