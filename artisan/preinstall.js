require('dotenv/config')
const path = require('path')
const shell = require('shelljs')

const { ARTISAN_NAME, ARTISAN_BASH_NAME, ARTISAN_AUTOCOMPLETE } = process.env

if (ARTISAN_AUTOCOMPLETE && ARTISAN_AUTOCOMPLETE == 'true') {
	shell.cd(path.resolve())

	shell.exec(`rm ~/.config/${ARTISAN_BASH_NAME}`)

	shell.exec(`touch ~/.config/${ARTISAN_BASH_NAME}`)

	shell.exec(`node artisan --completion >> ~/.config/${ARTISAN_BASH_NAME}`)

	shell.exec(`echo 'source ~/.config/${ARTISAN_BASH_NAME}' >> ~/.bashrc`)

	shell.exec(`echo 'alias ${ARTISAN_NAME}="node artisan"' >> ~/.bashrc`)
} else {
	console.log(
		'Artisan preinstall turn off in .env. Use ARTISAN_AUTOCOMPLETE=true'
	)
}
