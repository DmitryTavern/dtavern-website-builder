import { program } from 'commander'
import { reinjectComponents } from '@utilities/artisan'

program
	.command('reinject:components')
	.description('reinject all components')
	.action(() => reinjectComponents('all'))
