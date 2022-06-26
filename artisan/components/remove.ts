import * as types from '@types'
import { reinjectComponents } from '@utilities/artisan'
import {
	rmdir,
	inquirerWrap,
	getComponents,
	getComponentDirectory,
	unregisterComponent,
} from '@utilities'

const getQuestions = () => [
	{
		type: 'checkbox',
		name: 'components',
		message: 'Select component:',
		choices: getComponents(),
		loop: false,
	},
]

export const removeComponentsCommand = () =>
	inquirerWrap(getQuestions(), (answers: types.RemoveComponentAnswers) => {
		const { components } = answers

		for (const component of components) {
			const componentDirectory = getComponentDirectory(component)

			rmdir(componentDirectory)

			unregisterComponent(component)
		}

		reinjectComponents('all')
	})
