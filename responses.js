const Joi = require('joi')
class Uploaded {
  constructor (properties) {
    this.secure_url = `https://s3.amazonaws.com/porta-inversiones/${properties.filename}`
  }
}
module.exports = {
  '200': {
    'secure_url': Joi.string().uri()
  },
  Uploaded: Uploaded
}
