const path = require('path')
const webpack = require('webpack')
const config = require('../webpack.config')

function watch() {
  let wpConf = config.map ((conf) => {
    return Object.assign({watch: true}, conf)
  });
  
  return new Promise(resolve => webpack(wpConf, (err, stats) => {
    if (err) console.log('Webpack', err)
      console.log(stats.toString({ /* stats options */ }))
      resolve()
    }
  ))
}

module.exports = { watch }
