export { __ } from './logger-messages'

export function error(...args: any[]) {
	console.error('\x1b[91m[error]:\x1b[0m', ...args)
}

export function log(...args: any[]) {
	console.log('\x1b[96m[log]:\x1b[0m', ...args)
}

export function warn(...args: any[]) {
	console.log('\x1b[93m[warn]:\x1b[0m', ...args)
}
