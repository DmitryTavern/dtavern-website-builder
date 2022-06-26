import * as types from '@types'
import { renamePage } from '@utilities/artisan'
import {
	__,
	error,
	inquirerWrap,
	getPages,
	existsPage,
	checkPageName,
} from '@utilities'

const getQuestions = () => [
	{
		type: 'list',
		name: 'oldName',
		message: 'The page you want to rename',
		choices: getPages(),
	},
	{ type: 'input', name: 'newName', message: 'New page name (without ext):' },
]

export const renamePageCommand = () =>
	inquirerWrap(getQuestions(), (answers: types.RenamePageAnswers) => {
		const { oldName, newName } = answers

		if (!checkPageName(newName)) {
			return error(__('ERROR_INVALID_NAME'))
		}

		if (existsPage(newName)) {
			return error(__('ERROR_NAME_TAKEN', { name: newName }))
		}

		renamePage(oldName, newName)
	})
