import * as types from '@types'
import { program } from 'commander'
import { reinjectComponents } from '@utilities/artisan'
import {
	rmdir,
	inquirerWrap,
	getComponents,
	getComponentDirectory,
	unregisterComponent,
} from '@utilities'

const removeComponentQuestions = [
	{
		type: 'checkbox',
		name: 'components',
		message: 'Select component:',
		choices: getComponents(),
		loop: false,
	},
]

const RemoveComponentCommand = (answers: types.RemoveComponentAnswers) => {
	const { components } = answers

	for (const component of components) {
		const componentDirectory = getComponentDirectory(component)

		rmdir(componentDirectory)

		unregisterComponent(component)
	}

	reinjectComponents('all')
}

program
	.command('remove:components')
	.description('remove component')
	.action(() => inquirerWrap(removeComponentQuestions, RemoveComponentCommand))
