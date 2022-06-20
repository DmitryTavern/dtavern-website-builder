import * as path from 'path'
import * as types from '../types'
import { program } from 'commander'
import { inquirerWrap } from '../helpers/inquirerWrap'
import { autoimport } from '../../scripts/helpers/mode'
import { rmdir } from '../../helpers/dir'
import { __ } from '../../helpers/logger'
import {
	readConfig,
	getComponentInfo,
	reinjectComponents,
	unregisterComponent,
} from '../helpers.components'

const { APP_COMPONENTS_DIR } = process.env

const removeComponentQuestions = [
	{
		type: 'checkbox',
		name: 'components',
		message: 'Select component:',
		choices: readConfig().toOneArray(),
		loop: false,
	},
]

const RemoveComponentCommand = (answers: types.RemoveComponentAnswers) => {
	const { components } = answers

	for (const component of components) {
		const { category, name } = getComponentInfo(component)
		rmdir(path.join(APP_COMPONENTS_DIR, component))
		unregisterComponent(category, name)
	}

	if (autoimport()) {
		reinjectComponents('all')
	}
}

program
	.command('remove:components')
	.description('remove component')
	.action(() => inquirerWrap(removeComponentQuestions, RemoveComponentCommand))
