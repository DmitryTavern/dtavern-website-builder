import { series, parallel } from 'gulp'

/**
 * Gulp tasks
 */
import { html } from './html'
import { fonts } from './fonts'
import { styles } from './styles'
import { sprite } from './sprite'
import { images } from './images'
import { scripts } from './scripts'
import { devserver } from './devserver'

/**
 *
 */
export const start = parallel(
  html,
  styles,
  scripts,
  images,
  fonts,
  sprite,
  devserver
)

/**
 *
 */
export const build = series(html, styles, scripts, images, fonts, sprite)
