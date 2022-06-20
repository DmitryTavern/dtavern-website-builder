import * as fs from 'fs'
import * as path from 'path'
import * as inquirer from 'inquirer'
import * as types from '../types'
import { program } from 'commander'
import { __, warn, log, error } from '../../helpers/logger'
import { inquirerWrap } from '../helpers/inquirerWrap'
import { cpdir } from '../../helpers/dir'
import {
	readConfig,
	registerComponent,
	reinjectComponents,
} from '../helpers.components'

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
			.filter(
				(name) =>
					fs
						.statSync(path.join(APP_PROJECT_STORE, category, name))
						.isDirectory() &&
					!readConfig().toOneArray().includes(`${category}/${name}`)
			)
			.map((name) => `${category}/${name}`)

		if (componentNames.length !== 0) {
			components.push(
				// @ts-ignore
				new inquirer.Separator('=== ' + category + ' ==='),
				...componentNames
			)
		}
	}

	return components
}

const storeComponents = getStoreComponents()
const importStoreQuestions = [
	{
		type: 'checkbox',
		name: 'components',
		message: 'Select components for import:',
		choices: storeComponents,
		loop: false,
	},
]

const importStore = (answers: types.ImportComponentsAnswers) => {
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

			continue
		}

		const componentConfig = JSON.parse(
			fs.readFileSync(componentConfigPath, { encoding: 'utf-8' })
		)

		if (!componentConfig.depends) {
			error(
				__('ERROR_COMPONENT_CONFIG_HAVE_NOT_PARAM', {
					component,
					param: 'depends',
				})
			)

			continue
		}

		if (!componentConfig.namespace) {
			error(
				__('ERROR_COMPONENT_CONFIG_HAVE_NOT_PARAM', {
					component,
					param: 'namespace',
				})
			)

			continue
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
	.action(() => {
		if (storeComponents.length === 0) {
			return warn(__('WARN_STORE_ALREADY_IMPORTED'))
		}

		return inquirerWrap(importStoreQuestions, importStore)
	})
