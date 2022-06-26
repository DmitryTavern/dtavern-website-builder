const omelette = require('omelette')

module.exports.autocomplete = ({ commands }) => {
	const { ARTISAN_NAME } = process.env

	const completion = omelette(`${ARTISAN_NAME} <commands>`)

	completion.on('commands', ({ reply }) => {
		reply(commands)
	})

	completion.init()
}
