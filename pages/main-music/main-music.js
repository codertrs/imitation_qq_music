// pages/main-music/main-music.js
import {
  getMusicBanner,
  getSongMenuList,
  getPlaylistDetail
} from "../../services/music"
import querySelect from "../../utils/query.select"

import {
  throttle
} from "underscore"

const querySelectThrottle = throttle(querySelect, 100)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "",
    banners: [],
    bannerHeight: 0,
    recommendSongs: [],

    // 歌单数据
    hotMenuList:[],
    recMenuList: [],

  },

   fetchSongMenuList() {
    //  使用异步加载
    getSongMenuList().then(res=>{
      this.setData({
        hotMenuList: res.playlists
      })
    }) 
    getSongMenuList("华语").then(res => {
      this.setData({ recMenuList: res.playlists })
    })
    
  },
  

  // 搜索点击监听
  onSearchClick(){
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },

//更多
onRecommendMoreClick(){
wx.navigateTo({
  url: '/pages/detail-song/detail-song?type=recommend',
})
},

  onBannerImageLoad(event) {
    querySelectThrottle(".banner-image").then(res => {

      this.setData({
        bannerHeight: res[0].height
      })
    })
  },

  async recommendSongs() {
    const res = await getPlaylistDetail(3778678)
    const playlist = res.playlist
    const recommendSongs = playlist.tracks.slice(0, 6)
    console.log("recommendSongs", recommendSongs);
    this.setData({
      recommendSongs
    })

  },

  async fetchMusicBanner() {
    const res = await getMusicBanner();
    this.setData({
      banners: res.banners
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchMusicBanner()
    this.recommendSongs()

    this.fetchSongMenuList()
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