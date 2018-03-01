// pages/index/deviceImg/deviceImg.js
var width = getApp().globalData.screenWidth-20;
var service_Url = getApp().globalData.service_Url;
var height = width*24 / 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataset:null,
    width: width,
    height: height,
    imgurl:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.dataset)
    var data = JSON.parse(options.dataset)
    var imgurl = service_Url+data.newurl
    console.log(imgurl)
    this.setData({
      dataset:data,
      imgurl: imgurl
    })
    console.log(height)
    wx.setNavigationBarTitle({
      
      title: data.timesto })
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