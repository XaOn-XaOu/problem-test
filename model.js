const fs = require('fs')
const {ObjectId} = require('mongodb')

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notess.json', dataJSON)
}

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notess.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

const addNote = (body) => {
    const notes = { ...loadNotes() }
    const id = '_' + new ObjectId()
    notes[id] = body
    saveNotes(notes)
    console.log('New note added!')
    return notes[id]
}

const readNote = (day) => {
    const notes = loadNotes()
    let oneDayData
    if (day) {
        oneDayData = notes.filter((a) => a.body.date.includes(day))
    } else {
        oneDayData = notes
    }
    let expenseAmount = 0
    let incomeAmount = 0
    for (i of oneDayData) {
        if (i.body.amount > 0) {
            incomeAmount += i.body.amount
        } else {
            expenseAmount += -i.body.amount
        }
    }
    return {
        record: oneDayData,
        expenseAmount: expenseAmount,
        incomeAmount: incomeAmount

    }
}

const updateNote = (id, body) => {
    const notes = { ...loadNotes() }
    const error = {}
    const target = notes[id]
    if (!target) {
        error.id = 'Counld not find ID'
        return [error, 404]
    }
    const parameter = ['description', 'type', 'date', 'amount']
    const canUpdates = Object.keys(body).every((a) => parameter.includes(a))
    if (!canUpdates) {
        error.key = 'Invalid key updates'
        return [error, 400]
    }
    for (i in body) {
        target[i] = body[i]
    }
    notes[id] = target
    saveNotes(notes)
    return [target, 200]
}

module.exports = {
    addNote: addNote,
    readNote: readNote,
    updateNote: updateNote
}