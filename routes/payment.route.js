const path = require('path')
const axios = require('axios')
const { Router } = require('express')
const User = require('../model/user')
const Wallet = require('../model/wallet')
const Transaction = require('../model/transaction')

const {
  updateWallet,
  createTransaction,
  createWalletTransaction,
  validateUserWallet,
} = require('../controller/wallet.controller')

const router = Router()

router.get('/pay', (req, res) => {
  res.sendFile(path.join(__dirname + '/../index.html'))
})

router.get('/response', async (req, res) => {
  const { transaction_id } = req.query

  // URL with transaction ID of which will be used to confirm transaction status
  const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`
  const response = await axios({
    url,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
    },
  })

  const { status, currency, id, amount, customer } = response.data.data

  //Check if transaction id already exists
  const transactionExist = await Transaction.findOne({ transactionId: id })

  if (transactionExist) {
    return res.status(409).send('Transaction Alerady Exist')
  }
  //Check if user exist in db
  const user = await User.findOne({ email: customer.email })

  const wallet = await validateUserWallet(user._id)

  await createWalletTransaction(user._id, status, currency, amount)

  //create Transaction
  await createTransaction(user._id, id, status, currency, amount, customer)

  await updateWallet(user._id, amount)
  return res.status(200).json({
    message: 'Wallet Funded Successfully.',
    data: wallet,
  })
})

//Wallet Balance

router.get('/wallet/:userId/balance', async (req, res) => {
  try {
    const { userId } = req.params

    const wallet = await Wallet.findOne({ userId })
    // user
    res.status(200).json(wallet.balance)
  } catch (err) {
    console.log(err)
  }
})

//...

module.exports = router
