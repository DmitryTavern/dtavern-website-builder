import * as path from 'path'
import { program } from 'commander'
import { __ } from '../../helpers/logger'
import { rmdir } from '../../helpers/rmdir'
import { autoimport } from '../../helpers/mode'
import { inquirerWrap } from '../../helpers/inquirerWrap'
import { RemoveComponentAnswers } from './types'

import {
	readConfig,
	getComponentInfo,
	reinjectComponents,
	unregisterComponent,
} from '../../component-utils'

const { APP_COMPONENTS_DIR } = process.env
const removeComponentQuestions = [
	{
		type: 'checkbox',
		name: 'components',
		message: 'Select component:',
		choices: readConfig().toOneArray(),
	},
]

const RemoveComponentCommand = (answers: RemoveComponentAnswers) => {
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
	.command('remove:component')
	.description('remove component')
	.action(() => inquirerWrap(removeComponentQuestions, RemoveComponentCommand))
