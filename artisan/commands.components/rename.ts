import * as types from '../types'
import { program } from 'commander'
import { getComponentNamespace } from '../helpers.namespaces'
import { inquirerWrap } from '../helpers/inquirerWrap'
import { autoimport } from '../../scripts/helpers/mode'
import { __, error } from '../../helpers/logger'
import {
	readConfig,
	renameComponent,
	reinjectComponents,
	getComponentInfo,
	existsComponentByCategory,
	checkComponentName,
} from '../helpers.components'

const renameComponentQuestions = [
	{
		type: 'list',
		name: 'oldComponent',
		message: 'The component you want to rename',
		choices: readConfig().toOneArray(),
	},
	{
		type: 'input',
		name: 'newName',
		message: 'New component name (without category):',
	},
]

const renameComponentCommand = (answers: types.RenameComponentAnswers) => {
	const { oldComponent, newName } = answers
	const { category } = getComponentInfo(oldComponent)
	const namespace = getComponentNamespace(oldComponent)

	if (!checkComponentName(newName)) {
		return error(__('ERROR_INVALID_NAME'))
	}

	if (existsComponentByCategory(category, newName)) {
		error(__('ERROR_NAME_TAKEN', { name: newName }))
		return
	}

	renameComponent(oldComponent, newName)

	if (autoimport()) {
		reinjectComponents(namespace)
	}
}

program
	.command('rename:component')
	.description('rename component')
	.action(() => inquirerWrap(renameComponentQuestions, renameComponentCommand))
