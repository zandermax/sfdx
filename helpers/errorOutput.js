const config = require('../config/config')

module.exports = err => {
  return '\n' + config.get('stars') + 'ERROR: ' + err + config.get('stars')
}
