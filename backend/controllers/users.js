const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body
  const userExists = await User.exists({ email })
  if (userExists) {
    response.status(400).send({ error: 'Email already exists' })
    return
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name,
    email,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  response.send('<p>Hello!!!</p>')
})

module.exports = usersRouter
