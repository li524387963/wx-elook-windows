// pages/mine/mine.js
var app = getApp()
var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userImg:'../../images/shuibiaoicon.png',
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    name:'',
    userInfo:{},
    left: screenWidth-10-26-8-100-10-12,
    width: screenWidth - 12,
    phoneleft: screenWidth - 10 - 26 - 8 - 100-12-100,
    uid:'',
    region:[],
    pwd:'',
    serPhone:'18513580522'
    

  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'enduser',
      success: function (res) {
        console.log(res.data)
        that.setData({
          name: res.data.enduser_phone_name,
          uid: res.data.enduser_enduser_id,
         
         
        })
      }
  });
    wx.getUserInfo({
      success: function (res) {
        that.setData({
         
          userInfo: res.userInfo,
        })
      },
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
    // wx.getStorage({
    //   key: 'enduser',
    //   success: function (res) {
    //     console.log(res.data)
    //   },
    //   fail: function (res) {
    //     console.log(res)
    //   },

    // })
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
  editUserAction:function(){
      wx.navigateTo({
        url: 'UserInfo/UserInfo',
      })
  },
  problemAction:function(){
  var that = this;
    wx.navigateTo({
      url: 'problem/problem?uid=' + that.data.uid,
    })
  },
  bindpwd:function(){
    
    var that = this;
    wx.navigateTo({
      url: '../login/findpwd/findpwd?index=1&phone=' + that.data.name,
    })
  },
  aboutTap:function(){
   wx.navigateTo({
     url: 'about/about',
   })
  },
  phoneTap:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.serPhone //仅为示例，并非真实的电话号码
    })
  },
  exitAction:function(){
    wx.reLaunch({
      url: '../login/login'
    })
    wx.clearStorage()
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