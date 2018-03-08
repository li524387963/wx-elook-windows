// pages/scan/scan.js
var windowWidth = getApp().globalData.screenWidth;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    left: windowWidth - 80 - 10 - 43 - 10 - 10 - 12,
    left1: windowWidth - 190 - 10 - 43 - 10 - 10 - 12,
    left2: windowWidth - 210 - 10 - 43 - 10 - 10 - 12,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  this.scanTap()
  },
  scanTap: function () {
    wx.scanCode({
      success: (res) => {
        var type = res.result.substring(0, 1);
        console.log(res.result.substring(0, 1))
        if (res.result.length === 9 && (type == 1 || type == 2 || type == 3)) {
          wx.navigateTo({
            url: '../index/deviceInfo/deviceInfo?deviceid=' + res.result,
          })
        } else {
          wx.showToast({
            title: '设备信息错误,请重新扫描',
            image: ".../../images/home_icon_orange@3x.png",
            duration: 2000
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '扫码错误',
          image: "../../images/home_icon_orange@3x.png",
          duration: 2000
        })
      }

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