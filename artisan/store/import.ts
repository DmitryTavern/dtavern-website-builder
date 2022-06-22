import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'
import { program } from 'commander'
import { reinjectComponents } from '@utilities/artisan'
import {
	__,
	log,
	warn,
	cpdir,
	inquirerWrap,
	getComponentInfo,
	registerComponent,
	getStoreComponentConfig,
	getFilteredStoreComponents,
} from '@utilities'

const { APP_PROJECT_STORE, APP_COMPONENTS_DIR } = process.env

const storeComponents = getFilteredStoreComponents()
const importStoreQuestions = [
	{
		type: 'checkbox',
		name: 'components',
		message: 'Select components for import:',
		choices: storeComponents,
		loop: false,
	},
]

const importStoreCommand = (answers: types.ImportComponentsAnswers) => {
	const { components } = answers

	if (!fs.existsSync(APP_PROJECT_STORE)) {
		return warn(__('ERROR_STORE_NOT_EXISTS'))
	}

	for (const component of components) {
		const { category, name } = getComponentInfo(component)
		const componentDir = path.join(APP_PROJECT_STORE, component)

		const componentConfig = getStoreComponentConfig(component)

		if (!componentConfig) continue

		for (const depend of componentConfig.depends) {
			if (!components.includes(depend)) {
				components.push(depend)

				log(
					__('LOG_STORE_COMPONENT_DEPENDS', {
						component,
						depend,
					})
				)
			}
		}

		cpdir(componentDir, path.join(APP_COMPONENTS_DIR, component))

		registerComponent(componentConfig.namespace, category, name)
	}

	reinjectComponents('all')
}

program
	.command('import:store')
	.description('import component from store')
	.action(() => {
		if (storeComponents.length === 0) {
			return warn(__('WARN_STORE_ALREADY_IMPORTED'))
		}

		return inquirerWrap(importStoreQuestions, importStoreCommand)
	})
