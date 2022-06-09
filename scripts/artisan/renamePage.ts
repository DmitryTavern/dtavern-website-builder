import { program } from 'commander'
import { __, error } from '../helpers/logger'
import { renamePage } from '../pages-utils'
import { inquirerWrap } from '../helpers/inquirerWrap'
import { getPageList, existsPage } from '../component-utils'

interface RenamePageAnswers {
	oldName: string
	newName: string
}
const renamePageQuestions = [
	{
		type: 'list',
		name: 'oldName',
		message: 'The page you want to rename',
		choices: getPageList(),
	},
	{ type: 'input', name: 'newName', message: 'New page name (without ext):' },
]

program
	.command('rename:page')
	.description('renaming page')
	.action(() =>
		inquirerWrap(renamePageQuestions, (answers: RenamePageAnswers) => {
			const { oldName, newName } = answers

			if (existsPage(newName)) {
				return error(__('ERROR_NAME_TAKEN', { name: newName }))
			}

			renamePage(oldName, newName)
		})
	)
