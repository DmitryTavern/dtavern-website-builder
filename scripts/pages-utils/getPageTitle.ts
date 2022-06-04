import { capitalize } from '../helpers/textTransformUtils'

const { APP_PROJECT_NAME } = process.env

export function getPageTitle(pageName: string) {
	return `title ${capitalize(pageName).replace(
		/-/gm,
		' '
	)} | ${APP_PROJECT_NAME}\n`
}
