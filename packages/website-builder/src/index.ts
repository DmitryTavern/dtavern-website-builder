import { series, parallel } from 'gulp'

/**
 * Gulp tasks
 */
import { html } from './html'
import { styles } from './styles'
import { scripts } from './scripts'

/**
 *
 */
export const start = parallel(html, styles, scripts)

/**
 *
 */
export const build = series(html, styles, scripts)
