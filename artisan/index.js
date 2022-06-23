require('module-alias/register')
require('dotenv/config')
require('ts-node/register')
const { program } = require('commander')

program.name('artisan')

// Page commands
require('./pages/create')
require('./pages/rename')

// Component commands
require('./components/create')
require('./components/rename')
require('./components/reinject')
require('./components/remove')

// Store
require('./store/install')
require('./store/import')
require('./store/update')

program.parse()
