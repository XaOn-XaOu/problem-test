const model = require('./model.js')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000


app.use(express.json())

app.post('/records', (req, res) => {
    const record = req.body
    const recordResult = model.addNote(record)
    res.status(201).send(recordResult)
})

app.get('/records', (req, res) => {
    const day = req.query.date.split('-')[2]
    const result = model.readNote(day)
    res.status(200).send(result)
})

app.patch('/records/:id', (req, res) => {
    const result = model.updateNote(req.params.id, req.body)
    res.status(result[1]).send(result[0])
})

app.listen(port, () => console.log('Listening on port ' + port))