const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../model/user')

exports.createAccount = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body

    // Validste User input
    if (!(email && password && first_name && last_name)) {
      return res.status(400).json('All input is required.')
    }
    // Check for existing user
    const oldUser = await User.findOne({ email })

    if (oldUser)
      return res.status(409).json('User already exists, Login instead.')

    // encrypt  password

    hashPassword = await bcrypt.hash(password, 10)

    // Create user into database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: hashPassword,
    })

    //Create Token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    )
    user.token = token

    return res.status(201).json({ data: user, token })
  } catch (error) {
    console.log(error)
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) {
      return res.status(400).json('All input is required')
    }

    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create Token
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.TOKEN_KEY,
        { expiresIn: '2h' }
      )
      user.save = token

      return res.status(200).json({ data: user, token })
    }
    res.status(400).json({ message: 'Invalid Credentials.' })
  } catch (error) {
    console.log(error)
  }
}
