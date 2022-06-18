import { program } from 'commander'
import { __, error } from '../../helpers/logger'
import { renamePage } from '../../pages-utils'
import { inquirerWrap } from '../../helpers/inquirerWrap'
import { RenamePageAnswers } from './types'
import { getPageList, existsPage, checkPageName } from '../../component-utils'

const renamePageQuestions = [
	{
		type: 'list',
		name: 'oldName',
		message: 'The page you want to rename',
		choices: getPageList(),
	},
	{ type: 'input', name: 'newName', message: 'New page name (without ext):' },
]

const renamePageCommand = (answers: RenamePageAnswers) => {
	const { oldName, newName } = answers

	if (!checkPageName(newName)) {
		return error(__('ERROR_INVALID_NAME'))
	}

	if (existsPage(newName)) {
		return error(__('ERROR_NAME_TAKEN', { name: newName }))
	}

	renamePage(oldName, newName)
}

program
	.command('rename:page')
	.description('renaming page')
	.action(() => inquirerWrap(renamePageQuestions, renamePageCommand))
