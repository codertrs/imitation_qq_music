// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../services/music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songMenus: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.fetchAllMenuList()
  },

  async fetchAllMenuList() {
    const tagRes=await getSongMenuTag()
    console.log("tagRes",tagRes);
    const tags = tagRes.tags
    // 根据tags去获取对应的歌单
    const allPromises = []
    for (const tag of tags) {
      const promise=getSongMenuList(tag.name)
      allPromises.push(promise)
    }

  // 统一调用setData
  Promise.all(allPromises).then(res=>{
    console.log("res",res);
    this.setData({
      songMenus: res
    })
  })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})