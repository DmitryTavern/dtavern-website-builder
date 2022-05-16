import * as fs from 'fs'
import * as path from 'path'
import { error } from './logger'

const { ARTISAN_TEMPLATES_DIR } = process.env

function loadTemplate(name: string) {
	const templatePath = path.join(ARTISAN_TEMPLATES_DIR, name)
	let template = undefined
	let exists = fs.existsSync(templatePath)

	if (exists) template = fs.readFileSync(templatePath, 'utf-8')
	if (!exists) error(`Template '${name}' not found`)

	const actions = {
		replace: (regex: string, content: string) => {
			if (exists) template = template.replace(regex, `${content}`)
			if (!exists)
				error(`Replacement for non-existent template '${name}' is not possible`)
			return actions
		},
		write: (path) => {
			if (exists) return fs.writeFileSync(path, template, 'utf-8')
			if (!exists)
				error(`Write for non-existent template '${name}' is not possible`)
		},
	}

	return actions
}

export function templateLoader() {
	return {
		load: loadTemplate,
	}
}
