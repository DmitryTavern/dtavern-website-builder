import { series, parallel } from 'gulp'

/**
 * Gulp tasks
 */
import { html } from './html'
import { styles } from './styles'

/**
 *
 */
export const start = parallel(html, styles)

/**
 *
 */
export const build = series(html, styles)
