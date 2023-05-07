/**
 * Returns true if the current environment is development.
 * @returns true - if node env is development.
 */
export const isDevelopment = () => process.env.NODE_ENV === 'development'

/**
 * Returns true if the current environment is production.
 * @returns true - if node env is production.
 */
export const isProduction = () => process.env.NODE_ENV === 'production'
