import * as types from '@types'
import { program } from 'commander'
import { renameComponent, reinjectComponents } from '@utilities/artisan'
import {
	__,
	log,
	error,
	inquirerWrap,
	getComponents,
	checkComponentName,
	existsComponentByName,
	getNamespaceByComponent,
} from '@utilities'

const renameComponentQuestions = [
	{
		type: 'list',
		name: 'component',
		message: 'The component you want to rename:',
		choices: getComponents(),
	},
	{
		type: 'input',
		name: 'newName',
		message: 'New component name (without category):',
	},
]

const renameComponentCommand = (answers: types.RenameComponentAnswers) => {
	const { component, newName } = answers

	if (!checkComponentName(newName)) {
		return error(__('ERROR_INVALID_NAME'))
	}

	if (existsComponentByName(newName)) {
		return error(__('ERROR_NAME_TAKEN', { name: newName }))
	}

	const namespace = getNamespaceByComponent(component)

	renameComponent(component, newName)

	reinjectComponents(namespace)

	log(
		__('LOG_SUCCESS_COMPONENT_RENAMED', {
			oldName: component,
			newName,
		})
	)
}

program
	.command('rename:component')
	.description('rename component')
	.action(() => inquirerWrap(renameComponentQuestions, renameComponentCommand))
