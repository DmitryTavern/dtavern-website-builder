import { program } from 'commander'
import { __, error } from '../helpers/logger'
import { inquirerWrap } from '../helpers/inquirerWrap'
import { getNamespacePathes, checkPageName } from '../component-utils'
import { createPage, includePageScript, includePageStyle } from '../pages-utils'

interface CreatePageAnswers {
	name: string
	scss: string
	js: string
}
const createPageQuestions = [
	{ type: 'input', name: 'name', message: 'Page name:' },
	{ type: 'confirm', name: 'scss', message: 'Create scss file?' },
	{ type: 'confirm', name: 'js', message: 'Create js file?' },
]

program
	.command('create:page')
	.description('create new page')
	.option('-f', 'force creating')
	.action((options) =>
		inquirerWrap(createPageQuestions, (answers: CreatePageAnswers) => {
			const { name, scss, js } = answers
			const pathes = getNamespacePathes(name)

			if (!checkPageName(name)) {
				return error(__('ERROR_INVALID_NAME'))
			}

			if (!options.f && pathes.pugFileExists) {
				return error(__('ERROR_PAGE_FILE_EXISTS', { file: 'Pug' }))
			}

			if (!options.f && pathes.scssFileExists && scss) {
				return error(__('ERROR_PAGE_FILE_EXISTS', { file: 'Scss' }))
			}

			if (!options.f && pathes.jsFileExists && js) {
				return error(__('ERROR_PAGE_FILE_EXISTS', { file: 'Js' }))
			}

			createPage(name)
			if (scss) includePageStyle(name)
			if (js) includePageScript(name)
		})
	)
