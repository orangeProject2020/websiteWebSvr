const APIS = require('./../lib/apis')
const UTILS = require('./../lib/utils')

module.exports = async (req, res, next) => {

  let url = req.originalUrl
  console.log('categotyMiddleware url', url)
  let template = ''

  let pageInfoRet = await APIS.getDataDetail({
    url: url
  })
  console.log('categotyMiddleware categoryInfoRet', pageInfoRet)
  let pageInfo = pageInfoRet.data || {}
  if (!pageInfo || !pageInfo.id || pageInfo.status !== 1) {
    return res.render('404')
  }

  let pageCategory = pageInfo.category
  if (pageCategory === 'category') {
    if (pageInfo.is_redirect === 1) {
      let childCategorysRet = await APIS.getDataList({
        pid: pageInfo.id,
        category: 'category',
        status: 1
      })
      if (childCategorysRet.data.count > 0) {
        let childCategory = childCategorysRet.data.rows[0]
        return res.redirect(childCategory.url)
      } else {
        return res.render('404')
      }

    }

    res.locals.category = pageInfo
    template = pageInfo.template

    // 找到文档
    let bannersDataRet = await APIS.getDataList({
      pid: pageInfo.id,
      category: 'document',
      document_type: 'banner',
      status: 1
    })
    res.categoryBanners = bannersDataRet.data.rows || []

    let configsDataRet = await APIS.getDataList({
      pid: pageInfo.id,
      category: 'document',
      document_type: 'config',
      status: 1
    })
    let categoryConfigs = configsDataRet.data.rows || []
    res.locals.categoryConfigs = UTILS.formatConfigData(categoryConfigs)

    let page = req.query.page || 1
    let limit = pageInfo.page_limit || 0
    let articlesDataRet = await APIS.getDataList({
      pid: pageInfo.id,
      category: 'document',
      document_type: 'article',
      status: 1,
      page: page,
      limit: limit
    })
    res.locals.categoryArticleList = articlesDataRet.data.rows || []
    res.locals.categoryArticleCount = articlesDataRet.data.count || 0


  } else if (pageCategory === 'document') {
    let categoryInfoRet = await APIS.getDataDetail({
      pid: pageInfo.id
    })
    console.log('categotyMiddleware categoryInfoRet', categoryInfoRet)
    let categoryInfo = categoryInfoRet.data || {}
    console.log('categotyMiddleware categoryInfo', categoryInfo)
    res.locals.category = categoryInfo
    res.locals.article = pageInfo

    template = categoryInfo.template_article

  }

  if (!template) {
    return res.render('404')

  } else {
    return res.render(template)
  }

  next()
}