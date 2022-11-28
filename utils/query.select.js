export default function querySelect(selector) {
  //获取页面上的节点信息
  //最常见的用法是使用这个接口来查询某个节点的当前位置，以及界面的滚动位置。
  return new Promise(resolve => {
    const query = wx.createSelectorQuery();
    query.select(selector).boundingClientRect()
    query.exec((res) => {
      resolve(res)
    })
  })
}