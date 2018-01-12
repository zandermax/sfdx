const config = require('../config/config')

module.exports = err => {
  return '\n' + config.stars + 'ERROR: ' + err + config.stars
}
