import { program } from 'commander'
import { reinjectComponents } from '../helpers.components'
import { autoimport } from '../../scripts/helpers/mode'
import { __, warn } from '../../helpers/logger'

const reinjectComponentsCommand = () => {
	if (!autoimport()) return warn(__('WARN_AUTOIMPORT_TURN_OFF'))

	reinjectComponents('all')
}

program
	.command('reinject:components')
	.description('reinject all components')
	.action(() => reinjectComponentsCommand())
