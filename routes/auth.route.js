const { Router } = require('express')
const { createAccount, loginUser } = require('../controller/auth.controller.js')
const router = Router()

router.route('/').get((req, res) => {
  return res.status(200).json({ mesage: 'Flutter test api' })
}),
  router.route('/register').post(createAccount)

router.route('/login').post(loginUser)
module.exports = router
