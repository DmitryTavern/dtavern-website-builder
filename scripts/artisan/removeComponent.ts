import * as path from 'path'
import { program } from 'commander'
import { __ } from '../helpers/logger'
import { rmdir } from '../helpers/rmdir'
import { autoimport } from '../helpers/mode'
import { inquirerWrap } from '../helpers/inquirerWrap'
import {
	readConfig,
	getComponentInfo,
	reinjectComponents,
	unregisterComponent,
} from '../component-utils'

interface RemoveComponentAnswers {
	component: string
}

const { APP_COMPONENTS_DIR } = process.env
const removeComponentsQuestions = [
	{
		type: 'list',
		name: 'component',
		message: 'Select component:',
		choices: readConfig().toOneArray(),
	},
]

program
	.command('remove:component')
	.description('remove component')
	.action(() =>
		inquirerWrap(
			removeComponentsQuestions,
			(answers: RemoveComponentAnswers) => {
				const { component } = answers
				const { category, name } = getComponentInfo(component)

				rmdir(path.join(APP_COMPONENTS_DIR, component))

				unregisterComponent(category, name)

				if (autoimport()) {
					reinjectComponents('all')
				}
			}
		)
	)
