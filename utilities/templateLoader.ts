import * as fs from 'fs'
import * as path from 'path'
import { __, error } from './logger'

interface ReplaceOptions {
	[key: string]: string
}

const { ARTISAN_TEMPLATES_DIR } = process.env

function loadTemplate(name: string) {
	const templatePath = path.join(ARTISAN_TEMPLATES_DIR, name)

	if (!fs.existsSync(templatePath)) {
		throw error(__('ERROR_TEMPLATE_NOT_FOUND', { name }))
	}

	return fs.readFileSync(templatePath, 'utf-8')
}

export function templateLoader(
	templateName: string,
	replaceOptions?: ReplaceOptions
) {
	let template = loadTemplate(templateName)

	if (replaceOptions) {
		for (const key in replaceOptions) {
			const replaceValue = replaceOptions[key]

			template = template.replace(
				new RegExp(`\\\${${key}}`, 'gm'),
				replaceValue
			)
		}
	}

	return template
}
