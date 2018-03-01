// pages/mine/problem/problem.js
var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth;
var proposal_URL = getApp().globalData.proposal_URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: screenHeight,
    screenWidth:screenWidth,
    width: screenWidth - 12,
    value:'',
    uid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      uid: options.uid
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
  inputAction:function(res){
    this.setData({
      value: res.detail.value
    })
  },
  subAction:function(){
    if(this.data.value.length !=0){

    
    var data = { enduserid: this.data.uid, content:this.data.value}
    this.requestPosalData(proposal_URL,data)
    }else{
      wx.showToast({
        title: '不能为空',
        image: "../../../images/home_icon_orange@3x.png",
        duration: 2000
      })
    }
  },
  requestPosalData: function (url, data) {
    console.log(data)
    var that = this
    wx.showLoading({
      title: '提交中...',
      icon: "loading",
      duration: 2000
    })
    wx.request({

      url: url,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },

      method: "POST",

      data: data,
      success: function (res) {

        console.log(res)
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        var ret_message = res.data.UserInfo.ret.status_code;

        if (ret_message === 10004118) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',

          });
          setTimeout(function () {
            wx.hideToast();
            wx.navigateBack({
              delta: 1
            })
          }, 2000)



        } else {
          wx.showToast({
            title: '提交失败',
            image: "../../../images/home_icon_orange@3x.png",
            duration: 2000
          });
        };


      },

      fail: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
          title: '提交失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
      }

    })

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