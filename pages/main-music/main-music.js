// pages/main-music/main-music.js
import {
  getMusicBanner,
  getSongMenuList,
  getPlaylistDetail
} from "../../services/music"
import querySelect from "../../utils/query.select"
import rankingStore from "../../store/rankingStore"
import recommendStore from "../../store/recommendStore"

import {
  throttle
} from "underscore"

const querySelectThrottle = throttle(querySelect, 100)
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "",
    banners: [],
    bannerHeight: 0,
    screenWidth: 375,

    recommendSongs: [],

    // 歌单数据
    hotMenuList: [],
    recMenuList: [],

    // 巅峰榜
    isRankingData: false,
    rankingInfos: {},

  },

  fetchSongMenuList() {
    //  使用异步加载
    getSongMenuList().then(res => {
      this.setData({
        hotMenuList: res.playlists
      })
    })
    getSongMenuList("华语").then(res => {
      this.setData({
        recMenuList: res.playlists
      })
    })

  },


  // 搜索点击监听
  onSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },

  //更多
  onRecommendMoreClick() {
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
  // async recommendSongs() {
  //   const res = await getPlaylistDetail(3778678)
  //   const playlist = res.playlist
  //   const recommendSongs = playlist.tracks.slice(0, 6)
  //   console.log("recommendSongs", recommendSongs);
  //   this.setData({
  //     recommendSongs
  //   })

  // },
  async fetchMusicBanner() {
    const res = await getMusicBanner();
    this.setData({
      banners: res.banners
    })
  },
  handleNewRanking(value) {
    if (!value.name) return
    this.setData({
      isRankingData: true
    })
    const newRankingInfos = {
      ...this.data.rankingInfos,
      newRanking: value
    }
    this.setData({
      rankingInfos: newRankingInfos
    })

  },
  handleOriginRanking(value) {
    if (!value.name) return
    this.setData({
      isRankingData: true
    })
    const newRankingInfos = {
      ...this.data.rankingInfos,
      originRanking: value
    }
    this.setData({
      rankingInfos: newRankingInfos
    })

  },
  handleUpRanking(value) {
    if (!value.name) return
    this.setData({
      isRankingData: true
    })
    const newRankingInfos = {
      ...this.data.rankingInfos,
      upRanking: value
    }

    this.setData({
      rankingInfos: newRankingInfos
    })
  },

  handleRecommendSongs(value){
    if(!value.tracks) return 
    this.setData({
      recommendSongs:value.tracks.slice(0, 6)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchMusicBanner()
    //使用store共享数据 替换原来赋值
    // this.recommendSongs()
    this.fetchSongMenuList()


    rankingStore.dispatch("fetchRankingDataAction")
    // 新歌榜
    rankingStore.onState("newRanking", this.handleNewRanking)
    //原创榜
    rankingStore.onState("originRanking", this.handleOriginRanking)
    // 飙升榜
    rankingStore.onState("upRanking", this.handleUpRanking)

    recommendStore.dispatch("fetchRecommendSongsAction")
    recommendStore.onState("recommendSongInfo",this.handleRecommendSongs)

    // 获取屏幕尺寸
    this.setData({
      screenWidth: app.globalData.screenWidth
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
    recommendStore.offState("recommendSongs", this.handleRecommendSongs)
    rankingStore.offState("newRanking", this.handleNewRanking)
    rankingStore.offState("originRanking", this.handleOriginRanking)
    rankingStore.offState("upRanking", this.handleUpRanking)

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