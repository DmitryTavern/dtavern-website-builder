import * as path from 'path'
import { program } from 'commander'
import { __, warn } from '../helpers/logger'
import { cpdir } from '../helpers/cpdir'
import { autoimport } from '../helpers/mode'
import { inquirerWrap } from '../helpers/inquirerWrap'
import {
	readConfig,
	getNamespaceList,
	getComponentInfo,
	getComponentsStore,
	reinjectComponents,
	registerComponent,
} from '../component-utils'

interface ImportComponentsAnswers {
	storeComponents: string[]
}

const { APP_PROJECT_STORE, APP_COMPONENTS_DIR, ARTISAN_COMPONENT_CATEGORIES } =
	process.env

const allNamespaces = getNamespaceList()
const allCategories = ARTISAN_COMPONENT_CATEGORIES.split(',')
const allComponentNames = readConfig()
	.toOneArray()
	.map((component) => getComponentInfo(component).name)
const allStoreComponents = getComponentsStore().filter(
	(component) => !allComponentNames.includes(component)
)
const importComponentsQuestions = [
	{
		type: 'checkbox',
		name: 'storeComponents',
		message: 'Select components for import form store:',
		choices: allStoreComponents,
	},
]

program
	.command('import:components')
	.description('importing components from store')
	.action(() => {
		if (allStoreComponents.length === 0) {
			return warn(__('WARN_NON_EXISTS_STORE_COMPONENTS'))
		}

		inquirerWrap(
			importComponentsQuestions,
			(answers: ImportComponentsAnswers) => {
				const { storeComponents } = answers
				const questions = []

				for (const component of storeComponents) {
					questions.push(
						{
							type: 'list',
							name: `category:${component}`,
							message: `Select category for \x1b[44m${component}\x1b[0m:`,
							choices: allCategories,
						},
						{
							type: 'list',
							name: `namespace:${component}`,
							message: `Select namespace for \x1b[44m${component}\x1b[0m:`,
							choices: allNamespaces,
						}
					)
				}

				inquirerWrap(questions, (choices) => {
					for (const name of storeComponents) {
						const category = choices[`category:${name}`]
						const namespace = choices[`namespace:${name}`]
						const fromPath = path.join(APP_PROJECT_STORE, name)
						const toPath = path.join(APP_COMPONENTS_DIR, category, name)

						cpdir(fromPath, toPath)

						registerComponent(namespace, category, name)

						if (autoimport()) {
							reinjectComponents(namespace)
						}
					}
				})
			}
		)
	})
