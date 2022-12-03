// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
import recommendStore from "../../store/recommendStore"
import {
  getPlaylistDetail
} from "../../services/music"
import playerStore from "../../store/playerStore"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "ranking",
    key: "newRanking",
    songInfo: {},
    id: ""
  },

  handleRanking(value) {
    this.setData({
      songInfo: value
    })
    wx.setNavigationBarTitle({
      title: value.name,
    })

  },

  async fetchMenuSongInfo() {
    const res = await getPlaylistDetail(this.data.id)
    this.setData({
      songInfo: res.playlist
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // type: ranking -> 榜单数据
    // type: recommend -> 推荐数据
    const type = options.type
    this.setData({
      type
    })

    if (type === "ranking") {
      const key = options.key
      this.data.key = key
      rankingStore.onState(key, this.handleRanking);
    } else if (type === "recommend") {
      recommendStore.onState("recommendSongInfo", this.handleRanking)
    } else if (type === "menu") {
      const id = options.id
      this.data.id = id
      this.fetchMenuSongInfo()

    }


  },

  // 保存歌曲到store
  onSongItemTap(){
    playerStore.setState("playSongList",this.data.songInfo.tracks)
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