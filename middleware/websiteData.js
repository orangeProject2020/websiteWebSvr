const APIS = require('./../lib/apis')
const UTILS = require('./../lib/utils')
const Tree = require('./../lib/tree')

module.exports = async (req, res, next) => {

  let websiteIndexRet = await APIS.getDataList({
    category: 'index'
  })
  console.log('websiteIndexRet:', websiteIndexRet)
  req.session.category = websiteIndexRet.data.rows[0]

  let websiteIndexId = websiteIndexRet.data.rows[0].id
  console.log('websiteIndexId:', websiteIndexId)

  let websiteData = {
    banners: [],
    configs: {},
    articles: []
  }

  let documentTypes = ['banner', 'config', 'article']
  for (let index = 0; index < documentTypes.length; index++) {
    let item = documentTypes[index];
    let websiteDataRet = await APIS.getDataList({
      pid: websiteIndexId,
      category: 'document',
      status: 1,
      type: item
    })
    console.log('websiteDataRet:', websiteDataRet)
    websiteDataRet.data.rows.forEach(item => {
      if (item.document_type == 'banner') {
        websiteData.banners.push(item)
      } else if (item.document_type == 'config') {
        websiteData.configs[item.name] = item.content
      } else if (item.document_type == 'article') {
        websiteData.articles.push(item)
      }
    })
  }

  console.log('websiteData:', websiteData)
  res.locals.websiteData = websiteData

  let categorysRet = await APIS.getDataList({
    status: 1,
    category: 'category'
  })
  let categorys = categorysRet.data.rows || []
  console.log('categorys:', categorys)
  res.locals.categorys = Tree.unlimitedForLayer(categorys)

  next()
}