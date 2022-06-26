require('module-alias/register')
require('dotenv/config')
require('ts-node/register')
const { program } = require('commander')
const { autocomplete } = require('./autocomplete')

const createPageCommandName = 'create:page'
const renamePageCommandName = 'rename:page'
const createComponentCommandName = 'create:component'
const renameComponentCommandName = 'rename:component'
const reinjectComponentsCommandName = 'reinject:components'
const removeComponentsCommandName = 'remove:components'
const installStoreCommandName = 'install:store'
const importStoreCommandName = 'import:store'
const updateStoreCommandName = 'update:store'

// Autocomplete for artisan

if (process.env.ARTISAN_AUTOCOMPLETE == 'true') {
	autocomplete({
		commands: [
			createPageCommandName,
			renamePageCommandName,
			createComponentCommandName,
			renameComponentCommandName,
			reinjectComponentsCommandName,
			removeComponentsCommandName,
			installStoreCommandName,
			importStoreCommandName,
			updateStoreCommandName,
		],
	})
}

program.name('artisan')

// Page commands

program
	.command(createPageCommandName)
	.description('create new page')
	.action(require('./pages/create').createPageCommand)

program
	.command(renamePageCommandName)
	.description('rename exists page')
	.action(require('./pages/rename').renamePageCommand)

// Component commands

program
	.command(createComponentCommandName)
	.description('create new component')
	.action(require('./components/create').createComponentCommand)

program
	.command(renameComponentCommandName)
	.description('rename exists component')
	.action(require('./components/rename').renameComponentCommand)

program
	.command(reinjectComponentsCommandName)
	.description('reinject all components')
	.action(require('./components/reinject').reinjectComponentsCommand)

program
	.command(removeComponentsCommandName)
	.description('remove exists components')
	.action(require('./components/remove').removeComponentsCommand)

// Store

program
	.command(installStoreCommandName)
	.description('install components store from git')
	.action(require('./store/install').installStoreCommond)

program
	.command(importStoreCommandName)
	.description('import components from store')
	.action(require('./store/import').importStoreCommand)

program
	.command(updateStoreCommandName)
	.description('update components store')
	.action(require('./store/update').updateStoreCommand)

program.parse()
