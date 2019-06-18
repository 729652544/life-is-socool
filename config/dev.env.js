'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 外网生产
  // REPORT_SERVER:'"http://39.104.93.212/"',
  // API_SERVER:'"http://39.104.93.212/envprod/"',
  // IMG_SERVER:'"http://39.104.93.212/envprod/front/picture/"',
  // ENV: '"outer_prod"',
  // 外网测试
  // REPORT_SERVER:'"http://39.104.93.212:9190/"',
  // API_SERVER:'"http://39.104.93.212/envtest/"',
  //IMG_SERVER:'"http://39.104.93.212/envtest/front/picture/"',
  // ENV: '"outer_test"',
  //外网开发
  // REPORT_SERVER:'"http://39.104.93.212:9190/"',
  // IMG_SERVER:'"http://39.104.93.212/envdev/front/picture"',
  // API_SERVER:'"http://39.104.93.212/envdev/"',
  // ENV: '"outer_dev"',
  // 内网生产
  // REPORT_SERVER:'"http://192.168.12.13:9090/"',
  // API_SERVER:'"http://192.168.12.13:9090/"',
  // IMG_SERVER:'"http://192.168.12.13:9091/picture/"',
  // ENV : '"inner_prod"',
  //内网测试

  IMG_SERVER:'"http://192.168.12.13:9191/picture/"',
  REPORT_SERVER:'"http://192.168.12.13:9191/"',
  API_SERVER:'"http://192.168.12.13:9190/"',
  ENV: '"inner_test"',
  // 客户 
  // REPORT_SERVER:'"http://219.234.140.50:18888/"',
  // API_SERVER:'"http://219.234.140.50:18888/"',
  // IMG_SERVER:'"http://219.234.140.50:18889/picture/"',
  // ENV : '"prod"',
  //旋哥
  // API_SERVER:'"http://192.168.2.198:8083/"',
  //喜哥
  // API_SERVER:'"http://192.168.2.171:8083/"',
  //代钢
  // API_SERVER:'"http://192.168.2.112:8083/"',
  //阳阳
  // API_SERVER:'"http://192.168.2.108:8083/"',
  //yry
//   API_SERVER:'"http://192.168.2.127:8083/"',
  //宋路显
  // API_SERVER:'"http://192.168.11.58:8083/"',

})
