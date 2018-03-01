// pages/login/setnewpwd/setnewpwd.js
var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth;
var backpwd_URL = getApp().globalData.backpwd_URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    width: screenWidth - 12,
    phone:'',
    pwd:'',
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      phone: options.phone,
      index: options.index
    })
  
  },
  phoneBindinput:function(res){
    this.setData({
      pwd: res.detail.value
    })
  },
  changeAction:function(){
    if (this.data.pwd.length < 6) {
      wx.showToast({
        title: '密码少于6位',
        image: "../../../images/home_icon_orange@3x.png",
        duration: 2000
      });
    }else{
      var data = { endusername: this.data.phone, newpwd: this.data.pwd, aip: 'ios' }
      this.requestData(backpwd_URL, data)
    }
  },
  requestData: function (url, data) {
    var that = this
    wx.showLoading({
      title: '正在请求...',
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

        console.log(res.data)
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        var status_code = res.data.UserInfo.ret.status_code;
       
       
      

        if (status_code == 10000300) {


          // wx.showLoading({
          //   title: '修改成功,重新登录',
          //   icon: "success",
          // });
          wx.showModal({
            title: '提示',
            content: '修改成功,请重新登录',
            showCancel:false,
            
            success: function (res) {
              if (res.confirm) {
                  if(that.data.index == 1){
                    wx.reLaunch({
                      url: '../login'
                    })
                    wx.clearStorage()
                  }else{
                    wx.navigateBack({
                      delta: 2
                    })
                  }
                
            
              } 
            }
          })



        } else{
          wx.showToast({
            title: '修改失败',
            image: "../../../images/home_icon_orange@3x.png",
            duration: 2000
          });
        }
          

      },

      fail: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
          title: '请求失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
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