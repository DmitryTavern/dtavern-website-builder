import * as fs from 'fs'
import * as path from 'path'
import { __, error } from '../../helpers/logger'

const { ARTISAN_TEMPLATES_DIR } = process.env

function loadTemplate(name: string) {
	const templatePath = path.join(ARTISAN_TEMPLATES_DIR, name)

	if (!fs.existsSync(templatePath)) {
		throw error(__('ERROR_TEMPLATE_NOT_FOUND', { name }))
	}

	let template = fs.readFileSync(templatePath, 'utf-8')

	const actions = {
		replace: (regex: RegExp | string, content: string) => {
			template = template.replace(regex, `${content}`)
			return actions
		},
		write: (path) => {
			return fs.writeFileSync(path, template, 'utf-8')
		},
	}

	return actions
}

export function templateLoader() {
	return {
		load: loadTemplate,
	}
}
