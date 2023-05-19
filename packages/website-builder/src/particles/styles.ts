import fs from 'fs'
import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from '../utils/watch'
import { watchViews } from '../utils/watchViews'
import { watchComponents } from '../utils/watchComponents'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from '../compilers/styleCompilers'

const sourceDir = resolveSource(env.styles.sourceDir)
const outputDir = resolveOutput(env.styles.outputDir)
const sourcePagesDir = resolveSource(env.styles.sourcePagesDir)
const outputPagesDir = resolveOutput(env.styles.outputPagesDir)
const sourceComponentsDir = resolveSource(env.components.sourceDir)
const stylesGlob = path.join(sourceDir, '*.scss')
const stylesPagesGlob = path.join(sourcePagesDir, '*.scss')
const stylesComponentsGlob = path.join(sourceComponentsDir, '**', '*.scss')

/**
 *
 */
gulp.task('build:styles', (done) => {
  gulp.series(
    compiler(stylesGlob, outputDir),
    compiler(stylesPagesGlob, outputPagesDir)
  )(done)
})

/**
 *
 */
gulp.task('start:styles', () => {
  const fn = devCompiler(stylesGlob, outputDir)
  const fnPages = devCompiler(stylesPagesGlob, outputPagesDir)

  fn.displayName = '[styles]: compile styles'

  watch(stylesGlob, gulp.series(fn, fnPages))

  watchViews(stylesPagesGlob, (pageName, pagePath) => {
    const fnPage = devCompiler(pagePath, outputPagesDir)
    fnPage.displayName = `[styles]: compile ${pageName} page`
    return fnPage
  })

  watchComponents(stylesComponentsGlob, (pageName, componentName) => {
    if (pageName === 'global') {
      return fn
    }

    const pagePath = path.join(sourcePagesDir, `${pageName}.scss`)

    if (fs.existsSync(pagePath)) {
      const fnPage = devCompiler(pagePath, outputDir)

      fnPage.displayName = `[styles]: compile ${pageName} stylesheet by ${componentName} component`

      return fnPage
    }

    throw new Error(
      `stylesheet of "${pageName}" page not found. Path: ${pagePath}`
    )
  })
})
