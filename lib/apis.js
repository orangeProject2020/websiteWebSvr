const Request = require('./../lib/request')
const uuid = require('uuid')
const config = require('./../config')
const DOMAIN = config.api.domain

class APIS {

  constructor() {
    this.request = new Request({
      channel_id: config.api.channel_id,
      key: config.api.key,
    })
  }

  async httpRequest(url, data = {}) {
    url = DOMAIN + url
    let headers = {
      uuid: uuid.v4(),
      timestamp: Date.now()
    }
    let ret = await this.request.post(url, data, headers)
    // console.log('httpRequest ret:', ret)
    return ret
  }

  /**
   * 获取列表数据
   * @param {*} data 
   */
  async getDataList(data = {}) {
    let ret = await this.httpRequest('/website/info/getDataList', data)
    console.log('getDataList ret:', ret)
    return ret
  }

  async getDataDetail(data = {}) {
    let ret = await this.httpRequest('/website/info/getDataDetail', data)
    console.log('getDataDetail ret:', ret)
    return ret
  }

}

module.exports = new APIS