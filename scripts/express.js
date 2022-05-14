require('dotenv/config')
const path = require('path')
const express = require('express')
const compression = require('compression')
const app = express()
const port = process.env.APP_PROD_SERVER_PORT

app.use(compression())
app.use(express.static('dest'))

app.get('/:page.html', (req, res) => {
	res.sendFile(path.resolve(`dest/${req.params.page}.html`))
})

app.get('/:res.json', (req, res) => {
	res.sendFile(path.resolve(`dest/${req.params.res}.json`))
})

app.listen(port, () => {
	console.log(`Server at http://localhost:${port}`)
})
