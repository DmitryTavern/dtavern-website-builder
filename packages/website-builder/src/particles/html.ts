import fs from 'fs'
import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from '../utils/watch'
import { watchViews } from '../utils/watchViews'
import { watchComponents } from '../utils/watchComponents'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from '../compilers/htmlCompilers'

const sourceDir = resolveSource(env.html.sourceDir)
const outputDir = resolveOutput(env.html.outputDir)
const sourceComponentsDir = resolveSource(env.components.sourceDir)
const viewsGlob = path.join(sourceDir, '**', '*.pug')
const viewsPagesGlob = path.join(sourceDir, '*.pug')
const viewsComponentsGlob = path.join(sourceComponentsDir, '**', '*.pug')

/**
 *
 */
gulp.task('build:html', (done) => {
  gulp.series(compiler(viewsPagesGlob, outputDir))(done)
})

/**
 *
 */
gulp.task('start:html', () => {
  const fn = devCompiler(viewsPagesGlob, outputDir)

  fn.displayName = '[html]: compile pages'

  watch([viewsGlob, `!${viewsPagesGlob}`], fn)

  watchViews(viewsPagesGlob, (pageName, pagePath) => {
    const fnPage = devCompiler(pagePath, outputDir)
    fnPage.displayName = `[html]: compile ${pageName} page`
    return fnPage
  })

  watchComponents(viewsComponentsGlob, (pageName, componentName) => {
    if (pageName === 'global') {
      return fn
    }

    const pagePath = path.join(sourceDir, `${pageName}.pug`)

    if (fs.existsSync(pagePath)) {
      const fnPage = devCompiler(pagePath, outputDir)

      fnPage.displayName = `[html]: compile ${pageName} page by ${componentName} component`

      return fnPage
    }

    throw new Error(
      `stylesheet of "${pageName}" page not found. Path: ${pagePath}`
    )
  })
})
