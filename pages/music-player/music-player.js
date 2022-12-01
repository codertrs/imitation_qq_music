// pages/music-player/music-player.js
import {
  getSongDetail,
  getSongLyric
} from "../../services/player"
import {
  throttle
} from 'underscore'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    pageTitles: ["歌曲", "歌词"],
    currentPage: 0,
    contentHeight: 0,
    statusHeight: 0,

    id: 0,

    currentSong: {},

    durationTime: 0,
  },

  // 监听导航栏
  onNavTabItemTap(event){
    console.log("event",event);
  },

  // 监听页面切换
  onSwiperChange(event) {
    this.setData({
      currentPage: event.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options", options);

    // 获取设备信息
    this.setData({
      statusHeight: app.globalData.statusHeight,
      contentHeight: app.globalData.contentHeight
    })

    // 获取传入的id
    const id = options.id
    this.setData({
      id
    })

    // 请求歌曲相关的数据
    // 根据id获取歌曲的详情
    getSongDetail(id).then(res => {
      console.log("res", res);
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt
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