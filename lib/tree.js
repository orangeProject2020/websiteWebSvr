class UnLimitTree {

  static unlimitedForLevel(cate, html = '--', pid = 0, level = 0) {
    let arr = []
    cate.forEach(item => {
      if (item.pid == pid) {
        item.level = level + 1
        item.html = new Array(level + 1).join(html)
        arr.push(item)
        arr = arr.concat(this.unlimitedForLevel(cate, html, item.id, level + 1))
      }
    })

    return arr
  }

  //组合多维数组
  static unlimitedForLayer(cate, name = 'child', pid = 0) {
    let arr = []
    cate.forEach(item => {
      if (item.pid == pid) {
        item[name] = this.unlimitedForLayer(cate, name, item.id)
        arr.push(item)
      }
    })

    return arr
  }

  //传递一个子分类ID返回所有的父级分类
  static getParents(cate, id) {
    let arr = []
    cate.forEach(item => {
      if (item.id == id) {
        arr.push(item)
        arr = arr.concat(this.getParents(cate, item.pid))
      }
    })

    return arr
  }

  //传递一个父级分类ID返回所有子分类ID
  static getChildIds(cate, pid) {
    let arr = [];
    cate.forEach(item => {
      if (item.pid == pid) {
        arr.push(item.id)
        arr = arr.concat(this.getChildIds(cate, item.id))
      }
    })

    return arr
  }

  static getChilds(cate, pid) {
    let arr = [];
    cate.forEach(item => {
      if (item.pid == pid) {
        arr.push(item)
        arr = arr.concat(this.getChilds(cate, item.id))
      }
    })

    return arr
  }

}

module.exports = UnLimitTree