// pages/music-player/music-player.js
import {
  getSongDetail,
  getSongLyric
} from "../../services/player"
import {
  throttle
} from 'underscore'

import {
  parseLyric
} from "../../utils/parse-lyric"

const app = getApp()

// 创建播放器
const audioContext = wx.createInnerAudioContext()


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
    currentLyricText: "",
    // 当前歌词下标
    currentLyricIndex: -1,
    currentSong: {},
    //歌词
    lyricInfos: [],
    // 歌词当前取值
    sliderValue: 0,
    // 开始时长
    currentTime: 0,
    //持续时长
    durationTime: 0,

    //是否播放
    isPlaying: true
  },

  // 监听导航栏
  onNavTabItemTap(event) {

    const index = event.currentTarget.dataset.index;
    this.setData({
      currentPage: index
    })
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

    //获取歌词信息
    getSongLyric(id).then(res => {
      const lrcString = res.lrc.lyric
      console.log("lrcString", lrcString);
      const lyricInfos = parseLyric(lrcString)
      console.log("解析后", lyricInfos);
      this.setData({
        lyricInfos
      })

    })

    // 播放当前的歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true

    //监听播放的进度
    const throttleUpdateProgress = throttle(this.updateProgress, 500, {
      leading: false,
      trailing: false
    })

    // 监听音频播放进度
    audioContext.onTimeUpdate(() => {
      //当前 歌曲进度
      throttleUpdateProgress()

      // 匹配正确的歌词
      if (!this.data.lyricInfos.length) return
      let index = this.data.lyricInfos.length - 1
      for (let i = 0; i < this.data.lyricInfos.length; i++) {
        const info = this.data.lyricInfos[i]
        if (info.time > audioContext.currentTime * 1000) {
          index = i - 1
          break
        }
      }
      if (index === this.data.currentLyricIndex) return
      const currentLyricText = this.data.lyricInfos[index].text
      this.setData({
        currentLyricText,
        currentLyricIndex: index
      })

          // audioContext.onWaiting(()=>{
        //   audioContext.pause()
        // })

        // audioContext.onCanplay(()=>{
        //   audioContext.play()
        // })

    })

  },

  // 滑块监听
  onSliderChange(event) {
    console.log("event", event);

  },
  updateProgress() {
    // 1.记录当前的时间
    const sliderValue = this.data.currentTime / this.data.durationTime * 100
    this.setData({
      currentTime: audioContext.currentTime * 1000,
      sliderValue
    })

  },

  // 暂停/ 开始
  onPlayOrPauseTap() {
    // 是否暂停
    if (!audioContext.paused) {
      audioContext.pause()
      this.setData({
        isPlaying: false
      })

    } else {
      audioContext.play()
      this.setData({
        isPlaying: true
      })
    }
  },





})