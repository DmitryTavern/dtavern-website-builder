const { APP_PROJECT_NAME } = process.env

function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export function createPageTitle(pageName: string) {
	return `title ${capitalize(pageName).replace(
		/-/gm,
		' '
	)} | ${APP_PROJECT_NAME}\n`
}
