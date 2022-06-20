require('dotenv/config')
require('ts-node/register')
const { program } = require('commander')

program.name('artisan')

// Page commands
require('./commands.pages/create')
require('./commands.pages/rename')

// Component commands
require('./commands.components/create')
require('./commands.components/import')
require('./commands.components/rename')
require('./commands.components/reinject')
require('./commands.components/remove')

// Store
require('./commands.store/install')
require('./commands.store/update')

program.parse()
