import path from 'path'
import gulp from 'gulp'
import { watcher } from './watchers/watcher'
import { environment } from '@shared/environment'
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
  const env = environment()

  const sourceDir = path.join(env.root, env.sourceDir, env.scripts.sourceDir)
  const sourcePagesDir = path.join(
    env.root,
    env.sourceDir,
    env.scripts.sourcePagesDir
  )
  const sourceVendorDir = path.join(
    env.root,
    env.sourceDir,
    env.scripts.sourceVendorDir
  )

  const outputDir = path.join(env.root, env.outputDir, env.scripts.outputDir)
  const outputPagesDir = path.join(
    env.root,
    env.outputDir,
    env.scripts.outputPagesDir
  )
  const outputVendorDir = path.join(
    env.root,
    env.outputDir,
    env.scripts.outputVendorDir
  )

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
