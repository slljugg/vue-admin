const express = require('express')
const compression = require('compression')
const port = 8080
const app = express()

app.use(compression())
app.use(express.static(__dirname + '/static'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.listen(port, () => {
  console.log(port)
})