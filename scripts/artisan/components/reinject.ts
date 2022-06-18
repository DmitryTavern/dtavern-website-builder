import { program } from 'commander'
import { __, warn } from '../../helpers/logger'
import { autoimport } from '../../helpers/mode'
import { reinjectComponents } from '../../component-utils'

const reinjectComponentsCommand = () => {
	if (!autoimport()) return warn(__('WARN_AUTOIMPORT_TURN_OFF'))

	reinjectComponents('all')
}

program
	.command('reinject:components')
	.description('reinject all components')
	.action(() => reinjectComponentsCommand())
