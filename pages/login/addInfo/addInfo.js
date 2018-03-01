// pages/login/addInfo/addInfo.js
var Util = require('../../../utils/util.js');
var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth;
var login_URL = getApp().globalData.login_URL;
var addenduserinfo_URL = getApp().globalData.addenduserinfo_URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    width: screenWidth - 12,
    region: ['北京市', '北京市', '东城区'],
    email:'',
    address:'',
    userData:{},
   
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uerData = JSON.parse(options.data)
    this.setData({
      userData: uerData
    })
    console.log(uerData)
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

  emailBindinput: function (res) {
    this.setData({
      email: res.detail.value
    })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    if (e.detail.value[1] == '县') {
      e.detail.value[1] = e.detail.value[0]

    }
    
    this.setData({
      region: e.detail.value
    })
    
    console.log(this.data.region)
  },
  addressBindinput:function(res){
    this.setData({
      address: res.detail.value
    })
  },
  registerAction:function(){
    var mail = this.data.email;
      var province = this.data.region[0];
      var city = this.data.region[1];
      var area = this.data.region[2];
      var addr = this.data.address;
      var endusername = this.data.userData.endusername
     var data = { mail: mail, province: province, city: city, area: area, addr: addr, endusername: endusername};
     var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    
     var strEmail = pattern.test(mail);  
   
     console.log(strEmail);

     if (strEmail==false){
       wx.showToast({
         title: '邮箱错误',
         image: "../../../images/home_icon_orange@3x.png",
         duration: 2000
       })
     } else if(addr.length ==0){
       wx.showToast({
         title: '地址不能为空',
         image: "../../../images/home_icon_orange@3x.png",
         duration: 2000
       })
     }else{
       this.requestAdduserData(addenduserinfo_URL, data)
     }

  },
  requestAdduserData: function (url, data) {
    console.log(data)
    var that = this
    wx.showLoading({
      title: '保存中...',
      icon: "loading",
      duration: 2000
    })
    wx.request({

      url: url,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
     
      method: "POST",
     
      data:data,
      success: function (res) {

        console.log(res)
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
       var ret_message = res.data.UserInfo.ret.status_code;

        if (ret_message === 10000106) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            
          });
          setTimeout(function(){
            wx.hideToast();
            that.loginAction();
          },2000)
          
          

        } else {
          wx.showToast({
            title: '保存失败',
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
          title: '请求失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
      }

    })

  },
  loginAction:function(){
    
    var endusername = this.data.userData.endusername;
    var enduserpwd = this.data.userData.enduserpwd;
    var data = { endusername: endusername, enduserpwd: enduserpwd, aip: 'ios' };
    this.requestData(login_URL, data);
  },
  requestData: function (url, data) {
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

        console.log(res.data)
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        var ret_message = res.data.UserInfo.ret.ret_message;

        if (ret_message === "success") {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          });

          try {
            wx.setStorageSync('enduser', res.data.UserInfo.ret.data)
          } catch (e) {
          }
          wx.switchTab({
            url: '../../index/index'
          })
         


        } else {
          wx.showToast({
            title: '登录失败',
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
          title: '请求失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
      }

    })

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