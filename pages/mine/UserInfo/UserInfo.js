// pages/mine/UserInfo/UserInfo.js
var Util = require('../../../utils/util.js');
var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth;
var addenduserinfo_URL = getApp().globalData.addenduserinfo_URL;
var login_URL = getApp().globalData.login_URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    width: screenWidth - 12,
    pwd:'',
    emValue:'',
    region: [],
    province:'',
    city:'',
    area:'',
    adValue:'',
    endusername:'',
    userData: {},
    canIUse: wx.canIUse('picker.mode.region')
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
            //  emValue: res.data.enduser_mail,
            //  userData:res.data,
             endusername: res.data.enduser_phone_name,
             
            //  adValue: res.data.enduser_addr,
            //  region: [res.data.enduser_province, res.data.enduser_city, res.data.enduser_area],
             pwd: res.data.enduser_manager_pwd,

           })
           var endusername = that.data.endusername;
           var enduserpwd = that.data.pwd;
           var data = { endusername: endusername, enduserpwd: enduserpwd, aip: 'ios' };
           console.log(data, that.data.endusername)
           that.requestData(login_URL, data);

         }
       });

      
       
       
      
  },
  requestData: function (url, data) {
    var that = this
    wx.showLoading({
      
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

        
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        var ret_message = res.data.UserInfo.ret.ret_message;

        if (ret_message === "success") {
         

          try {
            wx.setStorageSync('enduser', res.data.UserInfo.ret.data)
          } catch (e) {
          }

          that.setData({
            emValue: res.data.UserInfo.ret.data.enduser_mail,
            userData: res.data.UserInfo.ret.data,
            endusername: res.data.UserInfo.ret.data.enduser_phone_name,

            adValue: res.data.UserInfo.ret.data.enduser_addr,
            region: [res.data.UserInfo.ret.data.enduser_province, res.data.UserInfo.ret.data.enduser_city, res.data.UserInfo.ret.data.enduser_area],
            pwd: res.data.UserInfo.ret.data.enduser_manager_pwd,

          })
       


        } else {
          wx.showToast({
            title: '获取失败',
            image: "../../../images/home_icon_orange@3x.png",
            duration: 2000
          });
        };


      },

      fail: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
          title: '获取失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
        console.log(res)
      }

    })

  },

  emailBindinput: function (res) {
    this.setData({
      emValue: res.detail.value
    })
  },

  bindRegionChange: function (e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)

    if (e.detail.value[1] == '县') {
      e.detail.value[1] = e.detail.value[0]

    }

    this.setData({
      region: e.detail.value
    })

    console.log(this.data.region)
  },
 
  addressBindinput: function (res) {
    this.setData({
      adValue: res.detail.value
    })
  },
  registerAction: function () {
    var mail = this.data.emValue;
    var province = this.data.region[0];
    var city = this.data.region[1];
    var area = this.data.region[2];
    var addr = this.data.adValue;
    var endusername = this.data.endusername
    var data = { mail: mail, province: province, city: city, area: area, addr: addr, endusername: endusername };
    var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

    var strEmail = pattern.test(mail);

    console.log(strEmail);

    if (strEmail == false) {
      wx.showToast({
        title: '邮箱错误',
        image: "../../../images/home_icon_orange@3x.png",
        duration: 2000
      })
    } else if (addr.length == 0) {
      wx.showToast({
        title: '地址不能为空',
        image: "../../../images/home_icon_orange@3x.png",
        duration: 2000
      })
    } else {
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

      data: data,
      success: function (res) {

        console.log(res)
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        var ret_message = res.data.UserInfo.ret.status_code;

        if (ret_message === 10000106) {

          var UserData = that.data.userData;
          UserData.enduser_mail = that.data.emValue;
            UserData.enduser_province = that.data.region[0];
            UserData.enduser_city = that.data.region[1];
            UserData.enduser_area = that.data.region[2];
            UserData.enduser_addr = that.data.adValue;



          try {
            wx.setStorageSync('enduser', UserData)
          } catch (e) {
          }
          wx.showToast({
            title: '保存成功',
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