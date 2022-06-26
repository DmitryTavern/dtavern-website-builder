require('module-alias/register')
require('dotenv/config')
require('ts-node/register')
const { program } = require('commander')

program.name('artisan')

// Page commands

program
	.command('create:page')
	.description('create new page')
	.action(require('./pages/create').createPageCommand)

program
	.command('rename:page')
	.description('rename exists page')
	.action(require('./pages/rename').renamePageCommand)

// Component commands

program
	.command('create:component')
	.description('create new component')
	.action(require('./components/create').createComponentCommand)

program
	.command('rename:component')
	.description('rename exists component')
	.action(require('./components/rename').renameComponentCommand)

program
	.command('reinject:components')
	.description('reinject all components')
	.action(require('./components/reinject').reinjectComponentsCommand)

program
	.command('remove:components')
	.description('remove exists components')
	.action(require('./components/remove').removeComponentsCommand)

// Store

program
	.command('install:store')
	.description('install components store from git')
	.action(require('./store/install').installStoreCommond)

program
	.command('import:store')
	.description('import components from store')
	.action(require('./store/import').importStoreCommand)

program
	.command('update:store')
	.description('update components store')
	.action(require('./store/update').updateStoreCommand)

program.parse()
