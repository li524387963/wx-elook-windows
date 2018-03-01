// pages/login/login.js
var screenHeight = getApp().globalData.screenHeight;
var width = getApp().globalData.screenWidth - 40;
var login_URL = getApp().globalData.login_URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: screenHeight,
    width:width,
    phone:null,
    password:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
   
   
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
    wx.getStorage({
      key: 'enduser',
      success: function (res) {
        console.log(res.data)
      },
      fail: function (res) {
        console.log(res)
      },

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
  phoneBindinput: function (res) {
     
      this.setData({
        phone:res.detail.value
      })
  },
  nameBindinput:function(res){
   
    this.setData({
      password: res.detail.value
    })
  },
  loginAction:function(){
    var endusername = this.data.phone;
    var enduserpwd = this.data.password;
    var data = { endusername: endusername, enduserpwd: enduserpwd,aip:'ios'};
    // var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

    // var strEmail = pattern.test(endusername);  
    // console.log(strEmail)
    console.log(login_URL,data)
    this.requestData(login_URL,data);
    

    

  },
  requestData: function (url,data) {
    var that = this
    wx.showLoading({
      title: '登录中...',
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
        console.log(res)

        console.log(res.data)
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        var ret_message = res.data.UserInfo.ret.ret_message;
       
        if (ret_message === "success") {
          wx.showToast({
            title: '登录成功',
            icon:'success',
            duration: 2000
          });
          
          try {
            wx.setStorageSync('enduser', res.data.UserInfo.ret.data)
          } catch (e) {
          }
          wx.switchTab({
            url: '../index/index'
          })
          that.setData({
          })


        }else{
          wx.showToast({
            title: '登录失败',
            image: "../../images/home_icon_orange@3x.png",
            duration: 2000
          });
        };
       
       
      },

      fail: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
          title: '请求失败',
          image: "../../images/home_icon_orange@3x.png",
          duration: 2000
        });
        console.log(res)
      }

    })

  },
  register:function(){
      wx.navigateTo({
        url: 'register/register',
      })
  },
  find:function(){
    wx.navigateTo({
      url: 'findpwd/findpwd',
    })
    // wx.navigateTo({
    //   url: '../index/configDevice/configDevice',
    // })

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
 