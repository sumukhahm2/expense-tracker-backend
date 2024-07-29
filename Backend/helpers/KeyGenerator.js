const { Console } = require('console')
const crypto=require('crypto')


const key=crypto.randomBytes(32).toString('hex')

Console.log(key)