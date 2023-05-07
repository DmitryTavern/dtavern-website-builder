import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watcher } from './watchers/watcher'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { isDevelopment, isProduction } from '@shared/mode'
import { TaskFunction, TaskFunctionCallback } from 'gulp'
import {
  compiler,
  devCompiler,
  vendorCompiler,
  devVendorCompiler,
} from './compilers/scriptCompilers'

/**
 * Function for scripts processing.
 * @param done gulp TaskFunctionCallback
 */
export const scripts: TaskFunction = function scripts(
  done: TaskFunctionCallback
) {
  const sourceDir = resolveSource(env.scripts.sourceDir)
  const sourcePagesDir = resolveSource(env.scripts.sourcePagesDir)
  const sourceVendorDir = resolveSource(env.scripts.sourceVendorDir)
  const outputDir = resolveOutput(env.scripts.outputDir)
  const outputPagesDir = resolveOutput(env.scripts.outputPagesDir)
  const outputVendorDir = resolveOutput(env.scripts.outputVendorDir)
  const scriptsGlob = path.join(sourceDir, '*.js')
  const scriptsPagesGlob = path.join(sourcePagesDir, '*.js')
  const scriptsVendorGlob = path.join(sourceVendorDir, '*.js')

  const scriptsCompilerGlob = [
    scriptsGlob,
    `!${scriptsPagesGlob}`,
    `!${scriptsVendorGlob}`,
  ]

  const scriptsPageCompilerGlob = [
    `!${scriptsGlob}`,
    scriptsPagesGlob,
    `!${scriptsVendorGlob}`,
  ]

  const scriptsVendorCompilerGlob = [
    `!${scriptsGlob}`,
    scriptsVendorGlob,
    `!${scriptsPagesGlob}`,
  ]

  if (isProduction()) {
    const scriptsCompiler = compiler(scriptsCompilerGlob, outputDir)
    const scriptsPageCompiler = compiler(
      scriptsPageCompilerGlob,
      outputPagesDir
    )
    const scriptsVendorCompiler = vendorCompiler(
      scriptsVendorCompilerGlob,
      outputVendorDir
    )

    gulp.series(
      scriptsCompiler,
      scriptsPageCompiler,
      scriptsVendorCompiler
    )(done)
    return
  }

  if (isDevelopment()) {
    const scriptsCompiler = devCompiler(scriptsCompilerGlob, outputDir)
    const scriptsPageCompiler = devCompiler(
      scriptsPageCompilerGlob,
      outputPagesDir
    )
    const scriptsVendorCompiler = devVendorCompiler(
      scriptsVendorCompilerGlob,
      outputVendorDir
    )

    watcher(scriptsCompilerGlob, scriptsCompiler)
    watcher(scriptsPageCompilerGlob, scriptsPageCompiler)
    watcher(scriptsVendorCompilerGlob, scriptsVendorCompiler)
    return
  }
}
