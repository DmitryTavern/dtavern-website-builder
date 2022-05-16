export function error(...args: string[]) {
	console.error('\x1b[91m[error]:\x1b[0m', ...args)
}

export function log(...args: string[]) {
	console.log('\x1b[96m[log]:\x1b[0m', ...args)
}
