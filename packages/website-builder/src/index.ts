import { series, parallel } from 'gulp'

/**
 * Gulp tasks
 */
import { html } from './html'
import { fonts } from './fonts'
import { styles } from './styles'
import { images } from './images'
import { scripts } from './scripts'

/**
 *
 */
export const start = parallel(html, styles, scripts, images, fonts)

/**
 *
 */
export const build = series(html, styles, scripts, images, fonts)
