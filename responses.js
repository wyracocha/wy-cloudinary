const Joi = require('joi')
class Uploaded {
  constructor (properties) {
    this.public_id = properties.public_id
    this.version = properties.version
    this.format = properties.format
    this.resource_type = properties.resource_type
    this.created_at = properties.created_at
    this.etag = properties.etag
    this.url = properties.url
    this.secure_url = properties.secure_url
  }
}
module.exports = {
  '200': {
    'public_id': Joi.string(),
    'version': Joi.number(),
    'format': Joi.string(),
    'resource_type': Joi.string(),
    'created_at': Joi.any(),
    'etag': Joi.any(),
    'url': Joi.string().uri(),
    'secure_url': Joi.string().uri()
  },
  Uploaded: Uploaded
}
