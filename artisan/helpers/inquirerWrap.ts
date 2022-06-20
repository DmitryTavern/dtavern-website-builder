import * as inquirer from 'inquirer'
import { __, error } from '../../helpers/logger'

const inquirerError = (err) => error(__('ERROR'), err)

export function inquirerWrap<QuestionAnswer>(
	questions: inquirer.QuestionCollection<any>,
	cb: (object: QuestionAnswer) => void
) {
	return inquirer.prompt(questions).then(cb).catch(inquirerError)
}
