const http = require('http')

const app = require('./app')
const server = http.createServer(app)

const { PORT } = process.env
const port = PORT || 7000

server.listen(port, () => {
  console.log(`Server listening on ${port}`)
})
