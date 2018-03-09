// pages/index/bindFail/bindFail.js
var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth;
var deviceselect_URL = getApp().globalData.deviceselect_URL;
var service_Url = getApp().globalData.service_Url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    loseText:'设备异常',
    errpic:'',
    errpicurl:'',
    deviceid:'',
    page:'',
    deviceModel:{},
    imgArr:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ deviceid: options.deviceid, page: options.page});
      console.log(options)
      var data = { deviceid: this.data.deviceid }
      this.requestdeviceModel(deviceselect_URL, data)
  },
  requestdeviceModel: function (url, data) {
    var that = this
    wx.showLoading({
      title: '加载中...',
      icon: "loading",
      duration: 10000
    })
    wx.request({

      url: url,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: data,
      success: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        console.log(res)
        that.setData({ deviceModel: res.data.UserInfo.info });
        var errpic = res.data.UserInfo.info.device_dev_url_errpic;
        if (errpic==null){
          console.log(errpic)
          that.setData({ errpic: errpic });
        }else{
          var url = service_Url + errpic;
          console.log(url)
          that.setData({ errpicurl: url });
        }
      
        var state = res.data.UserInfo.info.device_dev_state;
        if (state=='4'){
          that.setData({ loseText: '比对失败' });
        }
      



      },

      fail: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
          title: '网络连接失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
      }

    })

  },
  rebindAction:function(){
    let deviceModel = JSON.stringify(this.data.deviceModel);
    if(this.data.page==1){
      wx.navigateTo({
        url: '../configDevice/configDevice?deviceModel=' + deviceModel,
      })
    }else{
      wx.navigateBack({

      })
    }
   
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