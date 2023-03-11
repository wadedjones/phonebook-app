const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('enter password in args')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://wadedjones:${password}@phonebook-app.ye1six4.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length < 4) {
    console.log('finding persons')
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close().then(process.exit(1))
    })
} else {
    const nameArg = process.argv[3]
    const numArg = process.argv[4]

    const person = new Person({
        name: nameArg,
        number: numArg,
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}