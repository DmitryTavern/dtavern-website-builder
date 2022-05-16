import * as fs from 'fs'
import * as path from 'path'
import { error } from './logger'

const {
	ARTISAN_COMPONENT_AUTOIMPORT,
	ARTISAN_COMPONENT_AUTOIMPORT_PUG_PATH,
	ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH,
	ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH,
} = process.env

type Extentions = 'pug' | 'scss' | 'js'
type Namespaces = 'global' | 'none' | string

export function componentInjector(ext: Extentions) {
	let globalFilePath: string | undefined
	let componentPath: string | undefined
	let namespace: Namespaces | undefined

	if (ext === 'pug') globalFilePath = ARTISAN_COMPONENT_AUTOIMPORT_PUG_PATH
	if (ext === 'scss') globalFilePath = ARTISAN_COMPONENT_AUTOIMPORT_SCSS_PATH
	if (ext === 'js') globalFilePath = ARTISAN_COMPONENT_AUTOIMPORT_JS_PATH

	const actions = {
		setNamespace: (_namespace: Namespaces) => {
			namespace = _namespace
			return actions
		},
		setPath: (_path: string) => {
			componentPath = _path
			return actions
		},
		write: () => {
			if (ARTISAN_COMPONENT_AUTOIMPORT) {
				if (!namespace) return error('componentInjector namespace is undefined')
				if (!componentPath) return error('componentInjector path is undefined')

				if (namespace === 'global') {
					const includePath = path.relative(globalFilePath, componentPath)
					let data = ''

					if (fs.existsSync(globalFilePath)) {
						data = fs.readFileSync(globalFilePath, { encoding: 'utf-8' })
					}

					if (ext === 'pug') data += `include ${includePath}\n`
					if (ext === 'scss') data += `@import '${includePath}';\n`
					if (ext === 'js') data += `require('${includePath}');\n`

					fs.writeFileSync(globalFilePath, data)
				} else if (namespace !== 'none') {
				}
			}
		},
	}

	return actions
}
