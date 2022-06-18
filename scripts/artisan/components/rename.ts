import { program } from 'commander'
import { __, error } from '../../helpers/logger'
import { autoimport } from '../../helpers/mode'
import { inquirerWrap } from '../../helpers/inquirerWrap'
import { RenameComponentAnswers } from './types'
import {
	readConfig,
	renameComponent,
	reinjectComponents,
	getComponentInfo,
	getComponentNamespace,
	existsComponentByCategory,
	checkComponentName,
} from '../../component-utils'

const renameComponentQuestions = [
	{
		type: 'list',
		name: 'oldName',
		message: 'The component you want to rename',
		choices: readConfig().toOneArray(),
	},
	{
		type: 'input',
		name: 'newName',
		message: 'New component name (without category):',
	},
]

const renameComponentCommand = (answers: RenameComponentAnswers) => {
	const { oldName, newName } = answers
	const { category } = getComponentInfo(oldName)
	const namespace = getComponentNamespace(oldName)

	if (!checkComponentName(newName)) {
		return error(__('ERROR_INVALID_NAME'))
	}

	if (existsComponentByCategory(category, newName)) {
		error(__('ERROR_NAME_TAKEN', { name: newName }))
		return
	}

	renameComponent(oldName, newName)

	if (autoimport()) {
		reinjectComponents(namespace)
	}
}

program
	.command('rename:component')
	.description('rename component')
	.action(() => inquirerWrap(renameComponentQuestions, renameComponentCommand))
