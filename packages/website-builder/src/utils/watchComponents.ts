import path from 'path'
import gulp from 'gulp'
import { components } from '@shared/components'

/**
 *
 */
interface ViewsWatcherCallback {
  (pageName: 'global' | string, componentName: string): gulp.TaskFunction
}

/**
 *
 * @param str
 * @returns
 */
const getBasename = (str: string) => {
  return path.basename(path.dirname(str))
}

/**
 *
 * @param str
 * @returns
 */
const getCategory = (str: string) => {
  return path.basename(path.dirname(path.dirname(str)))
}

/**
 *
 */
export const watchComponents = (
  glob: gulp.Globs,
  callback: ViewsWatcherCallback
) => {
  gulp
    .watch(glob, {
      ignoreInitial: false,
      ignored: /(^|[\/\\])\../,
    })
    .on('change', (componentFile: string) => {
      try {
        const componentName = getBasename(componentFile)
        const componentCategory = getCategory(componentFile)
        const component = `${componentCategory}/${componentName}`

        for (const page in components)
          if (components[page].includes(component))
            return gulp.series(callback(page, component))(() => {})
      } catch (error) {
        console.error(error)
      }
    })
}
