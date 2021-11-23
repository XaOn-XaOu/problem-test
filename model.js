const fs = require('fs')
const {ObjectId} = require('mongodb')

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON)
}

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

const addNote = (body) => {
    const notes = loadNotes()
    const _id = new ObjectId()
    notes.push({ _id, body })
    saveNotes(notes)
    console.log('New note added!')
    return { _id, body }
}

const readNote = (day) => {
    const notes = loadNotes()
    if (!day) {
        let expenseAmount = 0
        let incomeAmount = 0
        for (i of notes) {
            if (i.body.amount > 0) {
                incomeAmount += i.body.amount
            } else {
                expenseAmount += -i.body.amount
            }
        }
        return {
            record: notes,
            expenseAmount: expenseAmount,
            incomeAmount: incomeAmount
        }
    }
    oneDayData = notes.filter((a) => a.body.date.includes(day))
    return oneDayData
}

const updateNote = (_id, body) => {
    const notes = loadNotes()
    const error = {}
    let index = -1
    const target = notes.find((a, i) => {
        if (a._id == _id) {
            index = i
            return a._id
        }
    })
    if (!target) {
        error._id = 'Counld not find ID'
        return [error, 404]
    }
    const canUpdates = Object.keys(body).every((a) => ['description', 'type', 'date', 'amount'].includes(a))
    if (!canUpdates) {
        error.key = 'Invalid key updates'
        return [error, 400]
    }
    for (i in body) {
        target.body[i] = body[i]
    }
    notes[index] = target
    saveNotes(notes)
    return [target, 200]
}

module.exports = {
    addNote: addNote,
    readNote: readNote,
    updateNote: updateNote
}