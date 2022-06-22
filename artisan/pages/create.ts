import * as fs from 'fs'
import * as types from '@types'
import { program } from 'commander'
import {
	__,
	error,
	autoimport,
	inquirerWrap,
	checkPageName,
	getNamespacePathes,
} from '@utilities'

import {
	createPage,
	createPageStyle,
	createPageScript,
	includeStyleToPage,
	includeScriptToPage,
} from '@utilities/artisan'

const createPageQuestions = [
	{ type: 'input', name: 'name', message: 'Page name:' },
	{ type: 'confirm', name: 'scss', message: 'Create scss file?' },
	{ type: 'confirm', name: 'js', message: 'Create js file?' },
]

const createPageCommand = (answers: types.CreatePageAnswers) => {
	const { name, scss, js } = answers
	const pathes = getNamespacePathes(name)

	if (!checkPageName(name)) {
		return error(__('ERROR_INVALID_NAME'))
	}

	if (fs.existsSync(pathes.pugFile)) {
		return error(__('ERROR_PAGE_FILE_EXISTS', { file: 'Pug' }))
	}

	if (fs.existsSync(pathes.scssFile) && scss) {
		return error(__('ERROR_PAGE_FILE_EXISTS', { file: 'Scss' }))
	}

	if (fs.existsSync(pathes.jsFile) && js) {
		return error(__('ERROR_PAGE_FILE_EXISTS', { file: 'Js' }))
	}

	createPage(name)

	if (scss) {
		createPageStyle(name)
		if (autoimport()) includeStyleToPage(name)
	}

	if (js) {
		createPageScript(name)
		if (autoimport()) includeScriptToPage(name)
	}
}

program
	.command('create:page')
	.description('create new page')
	.action(() => inquirerWrap(createPageQuestions, createPageCommand))
