const { NODE_ENV, ARTISAN_COMPONENT_AUTOIMPORT } = process.env

export function isDev() {
	return NODE_ENV === 'development'
}

export function isProd() {
	return NODE_ENV === 'production'
}

export function autoimport() {
	return ARTISAN_COMPONENT_AUTOIMPORT == 'true'
}
