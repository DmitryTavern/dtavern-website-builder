import path from 'path'
import gulp from 'gulp'
import { watcher } from './watchers/watcher'
import { environment } from '@shared/environment'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
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
  const sourceDir = resolveSource(env.styles.sourceDir)
  const outputDir = resolveOutput(env.styles.outputDir)
  const sourcePagesDir = resolveSource(env.styles.sourcePagesDir)
  const outputPagesDir = resolveOutput(env.styles.outputPagesDir)
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
