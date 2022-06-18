import * as fs from 'fs'
import * as path from 'path'
import * as inquirer from 'inquirer'
import { mkdir } from '../../helpers/mkdir'
import { program } from 'commander'
import { autoimport } from '../../helpers/mode'
import { inquirerWrap } from '../../helpers/inquirerWrap'
import { __, log, error } from '../../helpers/logger'
import { templateLoader } from '../../helpers/templateLoader'
import { CreateComponentAnswers } from './types'
import {
	getPageList,
	registerComponent,
	reinjectComponents,
	checkComponentName,
} from '../../component-utils'

const {
	APP_COMPONENTS_DIR,
	ARTISAN_TEMPLATE_PUG_COMPONENT,
	ARTISAN_TEMPLATE_SCSS_COMPONENT,
	ARTISAN_TEMPLATE_JS_COMPONENT,
	ARTISAN_COMPONENT_CATEGORIES,
} = process.env

const namespaceChoices = ['global', 'none']
const namespaces = getPageList()
if (namespaces.length > 0) {
	namespaceChoices.push(new inquirer.Separator())
	namespaceChoices.push(...namespaces)
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
		choices: ARTISAN_COMPONENT_CATEGORIES.split(','),
	},
	{
		type: 'list',
		name: 'namespace',
		message: 'Where to connect this component?',
		choices: namespaceChoices,
	},
]

const createComponentCommand = (answers: CreateComponentAnswers) => {
	const { name, pug, scss, js, category, namespace } = answers
	const componentsDirPath = APP_COMPONENTS_DIR
	const targeteNamespace = namespace.replace('.pug', '')
	const categoryDirPath = path.join(componentsDirPath, category)
	const targetDirPath = path.join(categoryDirPath, name)
	const targetPath = path.join(targetDirPath, name)

	if (!checkComponentName(name)) {
		return error(__('ERROR_INVALID_NAME'))
	}

	if (fs.existsSync(targetDirPath)) {
		return error(__('ERROR_COMPONENT_EXISTS', { component: name, category }))
	}

	mkdir(targetDirPath)

	if (pug)
		templateLoader()
			.load(ARTISAN_TEMPLATE_PUG_COMPONENT)
			.replace(/\${name}/g, name)
			.write(`${targetPath}.pug`)

	if (scss)
		templateLoader()
			.load(ARTISAN_TEMPLATE_SCSS_COMPONENT)
			.replace(/\${name}/g, name)
			.write(`${targetPath}.scss`)

	if (js)
		templateLoader()
			.load(ARTISAN_TEMPLATE_JS_COMPONENT)
			.write(`${targetPath}.js`)

	log(__('LOG_SUCCESS_COMPONENT_ADDED', { name }))

	registerComponent(targeteNamespace, category, name)

	if (autoimport()) {
		reinjectComponents(targeteNamespace)
	}
}

program
	.command('create:component')
	.description('create new component')
	.action(() => inquirerWrap(createComponentQuestions, createComponentCommand))
