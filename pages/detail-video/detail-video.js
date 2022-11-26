// pages/detail-video/detail-video.js
import {
  getMVUrl,
  getMVInfo,
  getMVRelated
} from "../../services/video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    mvUrl: "",
    mvInfo: {},
    relatedVideo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取id
    const id = options.id;
    this.setData({
      id
    });


    this.fetchMVUrl()
    this.fetchMVInfo()
    this.fetchMVRelated()



  },

  //获取 mv 播放地址
  async fetchMVUrl() {
    const res = await getMVUrl(this.data.id)
    this.setData({
      mvUrl: res.data.url
    })
  },
  //可获取不同排行榜数据
  async fetchMVInfo() {
    const res = await getMVInfo(this.data.id)
    this.setData({
      mvInfo: res.data
    })

  },
  //获取相关视频
  async fetchMVRelated() {
    const res = await getMVRelated(this.data.id)
    console.log("relatedVideo",res);
    this.setData({
      relatedVideo: res.data
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