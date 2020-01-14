const express = require('express')
const proxy = require('express-http-proxy')
const app = express()
const port = 3000

app.use(express.static('build'))
app.use('/api', proxy('localhost:8080/api', {
  proxyReqPathResolver: req => '/api' + req.url
}))

app.listen(port, () => console.log(`Listening on port ${port}`))