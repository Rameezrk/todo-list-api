const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

let db, 
    dbConnectionString = process.env.DB_STRING, 
    dbName = 'todo'

MongoClient.connect(dbConnectionString, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, Connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err => {
        console.log(err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', async (req, res) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments(
        {completed: false})
        res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
    })
    



app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running you better catch it!')
})

app.post('/createTodo', (req, res) => {
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result => {
        console.log('todo has been added')
        res.redirect('/')
    })
})

app.delete('/deleteTodo', (req, res) => {
    console.log(req.body.rainbowUnicorn)
    db.collection('todos').deleteOne({todo: req.body.rainbowUnicorn})
    .then(result => {
        console.log('Items been deleted')
        res.json('Deleted it')
    })
    .catch(err => {
        console.log(err)
    })
})

app.put('/markComplete', (req, res) => {
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: true
        }
    })
    .then( result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
    .catch(err => {
        console.log(err)
    })
})

app.put('/undo', (req, res) => {
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: false
        }
    })
    .then( result => {
        console.log('Undo Completed Item')
        res.json('Undo Completed Item')
    })
    .catch(err => {
        console.log(err)
    })
})