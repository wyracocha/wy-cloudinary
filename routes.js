'use strict'
let Cloudinary = require('cloudinary')
const Boom = require('boom')
const Response = require('./responses')
const Schema = require('./schemas')
const Uuid = require('node-uuid')

async function Upload (req, opts) {
  try {
    return Cloudinary.uploader.upload(req.payload.file.path, null, opts, function (err, uploaded) {
      if (err) {
        return new Promise((resolve, reject) => {
          reject(err)
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(uploaded)
        })
      }
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
          let opts = {}

          req.payload.folder ? opts['folder'] = req.payload.folder : void (0)
          req.payload.tags ? opts['tags'] = req.payload.tags : void (0)

          opts['resource_type'] = req.payload.resource_type || 'image'
          opts.unique_filename = false
          opts.public_id = Uuid.v1()
          // let Upload = promisify(Cloudinary.uploader.upload)
          const U = await Upload(req, opts)
          let uploaded = new Response.Uploaded(U)

          return uploaded
        } catch (e) {
          return Boom.internal(e.message)
        }
      },
      payload: {
        maxBytes: 209715200,
        output: 'file',
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
