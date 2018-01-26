'use strict'
const Hapi = require('hapi')
const WyEnv = require('@wyracocha/wy-env')
const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('./package')
const Cloudinary = require('cloudinary')
let Server = null
const Routes = require('./routes')
async function RegisterSwagger (Server) {
  try {
    const swaggerOptions = {
      info: {
        title: 'Upload images to cloudinary',
        version: Pack.version
      }
    }
    await Server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      }
    ])
    return new Promise((resolve, reject) => {
      resolve(Server)
    })
  } catch (e) {
    return new Promise((resolve, reject) => {
      reject(new Error(e.message))
    })
  }
}
async function Gugure () {
  try {
    process.env.NODE_ENV === 'production' ? void (0) : await WyEnv()
    Server = Hapi.server({
      port: process.env.PORT,
      host: '0.0.0.0'
    })
    process.env.NODE_ENV !== 'production' ? await RegisterSwagger(Server) : void (0)
    Cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
    Routes(Server)
    await Server.start()
    console.log(`server is running on port ${process.env.PORT}`)
  } catch (e) {
    throw e
  }
}
Gugure()
