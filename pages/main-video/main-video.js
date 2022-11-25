// pages/main-video/main-video.js
import {
  getTopMV
} from "../../services/video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    videoList: [],
    hasMore:true
  },

  // 获取
  async fetchTopMV() {
      // 1.获取数据
    const res = await getTopMV(this.data.offset);
    
    //    // 2.将新的数据追加到原来数据的后面
       console.log("res",res);
   
       const newVideoList=[...this.data.videoList,...res.data];
       
    //   //  3.设置全新的数据
      this.setData({
        videoList:newVideoList
      })
      this.data.offset=this.data.videoList.length;
      this.data.hasMore=res.hasMore;
     
 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchTopMV();
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