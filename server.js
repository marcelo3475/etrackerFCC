require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
.then(() => {
  console.log('Connected to mongodb')
})
.catch((err) => {
  console.log('Error connecting to mongo')
  console.log(mongoose.connect.readyState)
})

const {Schema} = mongoose

const exerciseSchema = new Schema({
  userID: {type: String, required:true},
  description: String,
  duration: Number,
  date: Date,
})

const UserSchema = new Schema({
  username: String
})

const User =  mongoose.model('User', UserSchema)
const Exercise = mongoose.model('Exercise', exerciseSchema)

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  console.log(`req.body`, req.body)
  const newUser = new User({
    username: req.body.username
  })
  newUser.save((err, data) => {
    if(err || !data){
      res.send("There was a problem saving the user")
    }else{
      res.json(data)
    }
  })
})

app.post('/api/users/:id/exercises', (req, res)=>{
  const id = req.params.id
  const {description, duration, date} = req.body
  User.findById(id, (err, data) => {
    if(err || !userData) {
      res.send('Could not find User')
    }else{
      const newExercise = new Exercise({
        userId: id,
        description,
        duration,
        date: Date(date)
      })
      newExercise.save((err, data)=>{
        if(err || !data){
          res.send('There was an error saving the data')
        }else{
          const {description, duration, date, _id}=data;
          res.json({
            username: userData.username,
            description,
            duration,
            date: date.toDateString(),
            _id: userData.id
          })
        }
      })
    }
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
