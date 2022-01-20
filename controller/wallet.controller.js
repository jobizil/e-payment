const Wallet = require('../model/wallet')
const WalletTransaction = require('../model/wallet_transaction')
const Transaction = require('../model/transaction')

//Validating User wallet
const validateUserWallet = async userId => {
  try {
    //Check if user has a wallet, else create one
    const userWallet = await Wallet.findOne({ userId })
    if (!userWallet) {
      //create wallet
      const wallet = await Wallet.create({ userId })
      return wallet
    }
    return userWallet
  } catch (error) {
    console.log(error)
  }
}

//Create Wallet Transaction

const createWalletTransaction = async (userId, status, currency, amount) => {
  try {
    //create wallet transaction
    const walletTransaction = await WalletTransaction.create({
      amount,
      userId,
      isInflow: true,
      currency,
      status,
    })
    return walletTransaction
  } catch (error) {
    console.log(error)
  }
}

//Create Transaction
const createTransaction = async (
  userId,
  id,
  status,
  currency,
  amount,
  customer
) => {
  try {
    const transaction = await Transaction.create({
      userId,
      transactionId: id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone_number,
      amount,
      currency,
      paymantStatus: status,
      paymentGateway: 'flutterwave',
    })
    return transaction
  } catch (error) {
    console.log(error)
  }
}

//update wallet
const updateWallet = async (userId, amount) => {
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } },
      { new: true }
    )
    return wallet
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  updateWallet,
  createTransaction,
  createWalletTransaction,
  validateUserWallet,
}
