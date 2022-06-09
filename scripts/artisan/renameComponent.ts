import { program } from 'commander'
import { __, error } from '../helpers/logger'
import { autoimport } from '../helpers/mode'
import { inquirerWrap } from '../helpers/inquirerWrap'
import {
	readConfig,
	renameComponent,
	reinjectComponents,
	getComponentInfo,
	getComponentNamespace,
	existsComponentByCategory,
} from '../component-utils'

interface RenameComponentAnswers {
	oldName: string
	newName: string
}
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

program
	.command('rename:component')
	.description('renaming component')
	.action(() =>
		inquirerWrap(
			renameComponentQuestions,
			(answers: RenameComponentAnswers) => {
				const { oldName, newName } = answers
				const { category } = getComponentInfo(oldName)
				const namespace = getComponentNamespace(oldName)

				if (existsComponentByCategory(category, newName)) {
					error(__('ERROR_NAME_TAKEN', { name: newName }))
					return
				}

				renameComponent(oldName, newName)

				if (autoimport()) {
					reinjectComponents(namespace)
				}
			}
		)
	)
