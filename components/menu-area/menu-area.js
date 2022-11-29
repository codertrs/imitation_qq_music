// components/menu-area/menu-area.js

const app=getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menuList:{
      type:Array,
      type:[]
    },
    title:{
      type:String,
      vlaue:"默认歌单"
    }
  },


  lifetimes:{
    // 在组件实例进入页面节点树时执行
    attached(){
      this.setData({
        screenWidth:app.globalData.screenWidth
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenWidth:375
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onMenuMoreClick() {
      wx.navigateTo({
        url: '/pages/detail-menu/detail-menu',
      })
    }
  }
})
