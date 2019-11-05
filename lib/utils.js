class Utils {

  formatConfigData(items) {
    let configs = {}
    items.forEach(item => {
      configs[item.name] = item.content
    })
    return configs
  }
}

module.exports = new Utils