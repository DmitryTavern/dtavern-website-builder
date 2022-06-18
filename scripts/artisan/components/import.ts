import * as fs from 'fs'
import * as path from 'path'
import * as inquirer from 'inquirer'
import { program } from 'commander'
import { cpdir } from '../../helpers/cpdir'
import { inquirerWrap } from '../../helpers/inquirerWrap'
import { __, warn, log, error } from '../../helpers/logger'
import { ImportComponentsAnswers } from './types'
import { registerComponent, reinjectComponents } from '../../component-utils'

const { APP_PROJECT_STORE, APP_COMPONENTS_DIR } = process.env

const getStoreComponents = () => {
	const components = []
	const categories = fs
		.readdirSync(APP_PROJECT_STORE)
		.filter(
			(fileName) =>
				fs.statSync(path.join(APP_PROJECT_STORE, fileName)).isDirectory() &&
				fileName !== '.git'
		)

	for (const category of categories) {
		const componentNames = fs
			.readdirSync(path.join(APP_PROJECT_STORE, category))
			.filter((fileName) =>
				fs
					.statSync(path.join(APP_PROJECT_STORE, category, fileName))
					.isDirectory()
			)
			.map((name) => `${category}/${name}`)

		components.push(
			new inquirer.Separator('=== ' + category + ' ==='),
			...componentNames
		)
	}

	return components
}

const importStoreQuestions = [
	{
		type: 'checkbox',
		name: 'components',
		message: 'Select components for import:',
		choices: getStoreComponents(),
		loop: false,
	},
]

const importStore = (answers: ImportComponentsAnswers) => {
	const { components } = answers

	if (!fs.existsSync(APP_PROJECT_STORE)) {
		return warn(__('ERROR_STORE_NOT_EXISTS'))
	}

	for (const component of components) {
		const [category, name] = component.split('/')
		const componentDir = path.join(APP_PROJECT_STORE, category, name)
		const componentConfigPath = path.join(componentDir, `${name}.json`)

		if (!fs.existsSync(componentConfigPath)) {
			error(
				__('ERROR_COMPONENT_CONFIG_NOT_FOUND', {
					component,
				})
			)

			return
		}

		const componentConfig = JSON.parse(
			fs.readFileSync(componentConfigPath, { encoding: 'utf-8' })
		)

		if (!componentConfig.depends) {
			return error(
				__('ERROR_COMPONENT_CONFIG_HAVE_NOT_PARAM', {
					component,
					param: 'depends',
				})
			)
		}

		if (!componentConfig.namespace) {
			return error(
				__('ERROR_COMPONENT_CONFIG_HAVE_NOT_PARAM', {
					component,
					param: 'namespace',
				})
			)
		}

		for (const depend of componentConfig.depends) {
			if (!components.includes(depend)) {
				components.push(depend)

				log(
					`Component ${component} depedns ${depend}. Component ${depend} will be added to import`
				)
			}
		}

		cpdir(componentDir, path.join(APP_COMPONENTS_DIR, component))

		registerComponent(componentConfig.namespace, category, name)
	}

	reinjectComponents('all')
}

program
	.command('import:components')
	.description('import component from store')
	.action(() => inquirerWrap(importStoreQuestions, importStore))
