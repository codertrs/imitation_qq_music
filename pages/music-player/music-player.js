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
import playerStore from "../../store/playerStore"
const app = getApp() 

// 创建播放器
const audioContext = wx.createInnerAudioContext()

const modeNames = ["order", "repeat", "random"]
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

    //滑块是否改变
    isSliderChanging: false,
    //是否等待
    isWaiting: false,
    //是否播放
    isPlaying: true,

    // 滚动距离
    lyricScrollTop: 0,

    // 播放歌曲列表
    playSongList: [],
    //播放歌曲索引
    playSongIndex: 0,

    //是否第一次播放
    isFirstPlay: true,

    playModeIndex: 0, // 0:顺序播放 1:单曲循环 2:随机播放
    playModeName: "order"

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
    // 获取设备信息
    this.setData({
      statusHeight: app.globalData.statusHeight,
      contentHeight: app.globalData.contentHeight
    })

    // 获取传入的id
    const id = options.id
    this.setupPlaySong(id)

    //获取store共享歌曲
    playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)

  },


  // 播放歌曲
  setupPlaySong(id) {
    this.setData({
      id
    })

    // 请求歌曲相关的数据
    // 根据id获取歌曲的详情
    getSongDetail(id).then(res => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt
      })
    })

    //获取歌词信息
    getSongLyric(id).then(res => {
      const lrcString = res.lrc.lyric
      const lyricInfos = parseLyric(lrcString)
      // console.log("解析后", lyricInfos);
      this.setData({
        lyricInfos
      })

    })

    // 播放当前的歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true

    //监听播放的进度
    if(this.data.isFirstPlay){
      console.log("第一次进入");
      this.data.isFirstPlay = false
      const throttleUpdateProgress = throttle(this.updateProgress, 500, {
        leading: false,
        trailing: false 
      })
  
      // 监听音频播放进度
      audioContext.onTimeUpdate(() => {
        //当前 歌曲进度
        if (!this.data.isSliderChanging && !this.data.isWaiting) {
          throttleUpdateProgress()
        }
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
          lyricScrollTop: 35 * index,
          currentLyricIndex: index
        })
  
      })

      audioContext.onWaiting(() => {
        audioContext.pause()
      })

      audioContext.onCanplay(() => {
        audioContext.play()
      })
      audioContext.onEnded(()=>{
        // 单曲循环  不需切换下一首
        if(audioContext.loop) return
        
        this.changeNewSong()
      })

    }

  },


  // 滑块监听
  onSliderChange(event) {
    this.data.isWaiting = true

    setTimeout(() => {
      this.data.isWaiting = false
    }, 1500)

    // 点击滑块获取对应的value值
    const value = event.detail.value

    // 计算出要播放的位置时间
    const currentTime = value / 100 * this.data.durationTime

    // 设置播放器,播放计算出的时间
    audioContext.seek(currentTime / 1000)

    this.setData({
      currentTime: currentTime,
      isSliderChanging: false,
      sliderValue: value
    })

  },

  onSliderChanging: throttle((event)=>{
    console.log("拖动过程中触发次数");
    const value = event.detail.value
    // 根据当前的值, 计算出对应的时间
    const currentTime = value / 100 * this.data.durationTime
    this.setData({
      currentTime
    })
    //当前滑块正在滑动
    this.data.isSliderChanging = true
  },100) ,
  
 
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

  //模式切换
  onModeBtnTap() {
    // 1.计算新的模式
    let modeIndex = this.data.playModeIndex
    modeIndex = modeIndex + 1
    if (modeIndex === 3) modeIndex = 0

    if (modeIndex === 1) {
      audioContext.loop = true
    } else {
      audioContext.loop = false
    }
    // 2.保存当前的模式
    this.setData({
      playModeIndex: modeIndex,
      playModeName: modeNames[modeIndex]
    })

  },
  // 上一首
  onPrevBtnTap() {
    this.changeNewSong(false)
  },
  //下一首
  onNextBtnTap() {
    this.changeNewSong()
  },


  //切换歌曲
  changeNewSong(isNext = true) {
    // 1.获取之前的数据
    const length = this.data.playSongList.length;
    let index = this.data.playSongIndex

    // 计算最新索引
    switch (this.data.playModeIndex){
      case 1 :
        // break;
      case 0 :
        index = isNext ? index + 1 : index - 1
        // console.log("length", length, index);
        //索引达到最大 回到起始位置
        if (index === length) index = 0
        //索引最小 回到数组末尾
        if (index === -1) index = length - 1
        break
      case 2 :
        index = Math.floor(Math.random() * length)
        break
    }


    // 根据当前索引获取当前歌曲的信息
    const newSong = this.data.playSongList[index]

    //数据回到初始状态
    this.setData({
      currentSong: {},
      sliderValue: 0,
      currentTime: 0,
      durationTime: 0
    })

    //进行播放
    this.setupPlaySong(newSong.id)

    // 保存最新的索引
    playerStore.setState("playSongIndex", index)


  },

  // store数据共享
  getPlaySongInfosHandler({
    playSongList,
    playSongIndex
  }) {
    // console.log("playSongList", playSongList);
    if (playSongList) {
      this.setData({
        playSongList
      })
    }
    if (playSongIndex !== undefined) {
      this.setData({
        playSongIndex
      })
    }

  },

  onUnload() {
    playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
  }


})