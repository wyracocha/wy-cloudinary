'use strict'
const AWS = require('aws-sdk')
const Boom = require('boom')
const Response = require('./responses')
const Schema = require('./schemas')
const Uuid = require('node-uuid')
const {promisify} = require('util')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})
var s3 = new AWS.S3()
const PutObject = promisify(s3.putObject.bind(s3))

async function Upload (req, opts) {
  try {
    var base64data = Buffer.from(req.payload.file, 'binary')
    let filename = `${Uuid.v1()}.${req.payload.ext}`
    let fie = await PutObject({
      Bucket: 'porta-inversiones',
      Key: filename,
      Body: base64data,
      ACL: 'public-read'
    })
    return new Promise((resolve, reject) => {
      resolve({filename})
    })
  } catch (e) {
    return new Promise((resolve, reject) => {
      reject(new Error(e.mssage))
    })
  }
}
module.exports = (Server) => {
  Server.route({
    method: 'POST',
    path: '/',
    config: {
      description: 'Upload and image in base64 format',
      notes: 'Return the uploaded object info',
      tags: ['api', 'image'],
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      cors: {
        origin: ['*'],
        headers: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type', 'CORELATION_ID'],
        credentials: true
      },
      validate: {
        payload: Schema.payload,
        failAction: (request, h, source, error) => {
          return h.response({
            message: source.message
          }).code(400)
        }
      },
      handler: async (req, h) => {
        try {
          const U = await Upload(req)
          let uploaded = new Response.Uploaded(U)
          return uploaded
        } catch (e) {
          return Boom.internal(e.message)
        }
      },
      payload: {
        maxBytes: 209715200,
        // output: 'file',
        parse: true
      },
      response: {
        failAction: (request, h, source, error) => {
          return h.response({
            message: source.message
          }).code(400)
        },
        status: {
          '200': Response['200']
        }
      }
    }
  })
}
