import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as types from '@types'
import { program } from 'commander'
import { reinjectComponents, createComponentFiles } from '@utilities/artisan'
import {
	__,
	log,
	error,
	mkdir,
	inquirerWrap,
	getPages,
	getCategories,
	getComponent,
	getComponentDirectory,
	registerComponent,
	checkComponentName,
} from '@utilities'

const getCategoryChoices = () => {
	const categoryChoices: inquirer.ChoiceCollection = getCategories()
	if (categoryChoices.length > 0) {
		categoryChoices.push(new inquirer.Separator())
	}

	return [...categoryChoices, 'Create new']
}

const getNamespaceChoices = () => {
	const namespaceChoices: inquirer.ChoiceCollection = ['global', 'none']
	const namespaces = getPages()
	if (namespaces.length > 0) {
		namespaceChoices.push(new inquirer.Separator())
		namespaceChoices.push(...namespaces)
	}

	return namespaceChoices
}

const createComponentQuestions = [
	{ type: 'input', name: 'name', message: 'Component name:' },
	{ type: 'confirm', name: 'pug', message: 'Create pug file?' },
	{ type: 'confirm', name: 'scss', message: 'Create scss file?' },
	{ type: 'confirm', name: 'js', message: 'Create js file?' },
	{
		type: 'list',
		name: 'category',
		message: 'Select component category:',
		choices: getCategoryChoices(),
	},
	{
		type: 'input',
		name: 'newCategory',
		message: 'Input new category name:',
		when(answers) {
			return answers.category === 'Create new'
		},
	},
	{
		type: 'list',
		name: 'namespace',
		message: 'Where to connect this component?',
		choices: getNamespaceChoices(),
	},
]

const createComponentCommand = (answers: types.CreateComponentAnswers) => {
	const { name } = answers
	const category = answers.newCategory || answers.category

	const component = getComponent(category, name)
	const componentDirectory = getComponentDirectory(component)
	const componentNamespace = answers.namespace.replace('.pug', '')

	if (!checkComponentName(name)) {
		return error(__('ERROR_INVALID_NAME'))
	}

	if (fs.existsSync(componentDirectory)) {
		return error(__('ERROR_COMPONENT_EXISTS', { component: name, category }))
	}

	mkdir(componentDirectory)

	createComponentFiles(component, {
		pug: answers.pug,
		scss: answers.scss,
		js: answers.js,
	})

	log(__('LOG_SUCCESS_COMPONENT_ADDED', { name }))

	registerComponent(componentNamespace, category, name)

	reinjectComponents(componentNamespace)
}

program
	.command('create:component')
	.description('create new component')
	.action(() => inquirerWrap(createComponentQuestions, createComponentCommand))
