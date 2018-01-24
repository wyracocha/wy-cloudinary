'use strict'
let Cloudinary = require('cloudinary')
const Boom = require('boom')
const {promisify} = require('util')
const Joi = require('joi')
const Response = require('./responses')
const Schema = require('./schemas')
// -- configuration
Cloudinary.config({
  cloud_name: 'wyracocha-com', //process.env.CLOUDINARY_NAME,
  api_key: '116539467623123', // process.env.CLOUDINARY_API_KEY, 
  api_secret: 'Ugm47dGyuZeEz2h5ibbNdwFPuBg' // process.env.CLOUDINARY_API_SECRET
})
async function Upload (req, opts) {
  try {
    return Cloudinary.uploader.upload(req.payload.file, null, opts, function (err, uploaded) {
      if (err) {
        return new Promise((resolve, reject) => {
          resolve(err)
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(uploaded)
        })
      }
    })
  } catch (e) {
    return new Promise((resolve, reject) => {
      reject(new Error(e.mssage))
    })
  }
}
module.exports = (Server) => {
  Server.route({
    method: 'POST',
    path: '/',
    config: {
      description: 'Upload and image in base64 format',
      notes: 'Return the uploaded object info',
      tags: ['api', 'image'],
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
          
          req.payload.folder ? opts['folder'] = req.payload.folder: void(0)
          req.payload.tags ? opts['tags'] = req.payload.tags: void(0)
  
          opts['resource_type'] = req.payload.resource_type || 'image'
          // let Upload = promisify(Cloudinary.uploader.upload)
          let uploaded = new Response.uploaded( await Upload(req, opts) )

          return uploaded
        } catch (e) {
          return Boom.internal(e.message)
        }
      },
      response: {
        failAction: (request, reply, source, error) => {
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