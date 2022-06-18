import { program } from 'commander'
import { __, error } from '../../helpers/logger'
import { inquirerWrap } from '../../helpers/inquirerWrap'
import { getNamespacePathes, checkPageName } from '../../component-utils'
import { CreatePageAnswers } from './types'
import {
	createPage,
	includePageScript,
	includePageStyle,
} from '../../pages-utils'

const createPageQuestions = [
	{ type: 'input', name: 'name', message: 'Page name:' },
	{ type: 'confirm', name: 'scss', message: 'Create scss file?' },
	{ type: 'confirm', name: 'js', message: 'Create js file?' },
]

const createPageCommand = (answers: CreatePageAnswers) => {
	const { name, scss, js } = answers
	const pathes = getNamespacePathes(name)

	if (!checkPageName(name)) {
		return error(__('ERROR_INVALID_NAME'))
	}

	if (pathes.pugFileExists) {
		return error(__('ERROR_PAGE_FILE_EXISTS', { file: 'Pug' }))
	}

	if (pathes.scssFileExists && scss) {
		return error(__('ERROR_PAGE_FILE_EXISTS', { file: 'Scss' }))
	}

	if (pathes.jsFileExists && js) {
		return error(__('ERROR_PAGE_FILE_EXISTS', { file: 'Js' }))
	}

	createPage(name)
	if (scss) includePageStyle(name)
	if (js) includePageScript(name)
}

program
	.command('create:page')
	.description('create new page')
	.action(() => inquirerWrap(createPageQuestions, createPageCommand))
