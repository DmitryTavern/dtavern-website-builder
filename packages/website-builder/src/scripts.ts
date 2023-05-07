import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watcher } from './watchers/watcher'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import {
  compiler,
  devCompiler,
  vendorCompiler,
  devVendorCompiler,
} from './compilers/scriptCompilers'

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

/**
 * @param done gulp TaskFunctionCallback
 */
export const scriptsBuild: gulp.TaskFunction = function scripts(done) {
  const fn = compiler(scriptsCompilerGlob, outputDir)
  const fnPage = compiler(scriptsPageCompilerGlob, outputPagesDir)
  const fnVendor = vendorCompiler(scriptsVendorCompilerGlob, outputVendorDir)

  gulp.series(fn, fnPage, fnVendor)(done)
}

/**
 * @param done gulp TaskFunctionCallback
 */
export const scriptsStart: gulp.TaskFunction = function scripts() {
  const fn = devCompiler(scriptsCompilerGlob, outputDir)
  const fnPage = devCompiler(scriptsPageCompilerGlob, outputPagesDir)
  const fnVendor = devVendorCompiler(scriptsVendorCompilerGlob, outputVendorDir)

  watcher(scriptsCompilerGlob, fn)
  watcher(scriptsPageCompilerGlob, fnPage)
  watcher(scriptsVendorCompilerGlob, fnVendor)
}
