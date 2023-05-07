import { series, parallel } from 'gulp'

/**
 * Gulp tasks
 */
import { html } from './html'

/**
 * 
 */
export const start = series(html)

/**
 *
 */
export const build = parallel(html)
