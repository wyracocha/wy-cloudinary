'use strict'
const Hapi = require('hapi')
const WyEnv = require('@wyracocha/wy-env')
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

let Server = null
const Routes = require('./routes')
async function RegisterSwagger (Server) {
  try {
    const swaggerOptions = {
      info: {
          title: 'Upload images to cloudinary',
          version: Pack.version,
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
  try{
    await WyEnv()
    Server = Hapi.server({
      port: process.env.PORT,
      host: '0.0.0.0'
    })
    process.env.NODE_ENV !== 'production' ? await RegisterSwagger (Server): void(0)
    Routes(Server)
    await Server.start()
    console.log('server is running')
  } catch (e) {
    throw e
  }
}
Gugure()