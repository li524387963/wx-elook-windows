// pages/login/findpwd/findpwd.js
var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth;
var msgCode_URL = getApp().globalData.msgCode_URL;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: '../../../images/login_icon_4@3x.png',
    timeText: '获取验证码',
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    width: screenWidth - 12,
    Del: '',
    code: '',
    second: 60,
    backcolor: 'rgb(41, 182, 216)',
    msgcode: '',
    tapBL: true,
    onLoad:false,
    index:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad",options)

    this.setData({
      onLoad:true,
      index: options.index,
      Del:options.phone,
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
    console.log(this.data.onLoad)
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      onLoad: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  phoneBindinput: function (res) {

    this.setData({
      Del: res.detail.value
    })
  },
  codebind: function (res) {
    console.log(res)
    this.setData({
      code: res.detail.value
    })
  },
  getCode: function () {
    console.log(this.data.Del.length)
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.Del.length == 0) {
      wx.showToast({
        title: '手机号为空',
        image: "../../../images/home_icon_orange@3x.png",
        duration: 1500
      })
      return false;
    } else if (this.data.Del.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        image: "../../../images/home_icon_orange@3x.png",
        duration: 1500
      })
      return false;
    } else if (!myreg.test(this.data.Del)) {
      wx.showToast({
        title: '手机号有误！',
        image: "../../../images/home_icon_orange@3x.png",
        duration: 1500
      })
      return false;
    } else {
      console.log(this.data.Del)


      if (this.data.tapBL == true) {
        this.setData({
          tapBL: false,
          backcolor: 'rgb(234, 234, 234)'

        });
        countdown(this);
        var data = { phone: this.data.Del }
        this.requestData(msgCode_URL, data)


      }

    }
  },
  requestData: function (url, data) {
    var that = this
    wx.showLoading({
      title: '正在发送验证码',
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

        if (ret_message === "ok") {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          });

          that.setData({
            code: res.data.UserInfo.ret.msgcode,
            msgcode: res.data.UserInfo.ret.msgcode
          })



        } else {
          wx.showToast({
            title: '发送失败',
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
          title: '发送失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
      }

    })

  },
  nextAction:function(){
    if (this.data.msgcode != this.data.code) {
      wx.showToast({
        title: '验证码错误',
        image: "../../../images/home_icon_orange@3x.png",
        duration: 2000
      });1

    }else{
      wx.navigateTo({

        url: '../setnewpwd/setnewpwd?index='+this.data.index + '&phone='+this.data.Del ,
      })
    }
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
});
function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      second: 60,
      backcolor: 'rgb(41, 182, 216)',
      tapBL: true,
      timeText: '获取验证码',
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1,
      timeText: '获取验证码' + "(" + second + ')'
    });
    countdown(that);
  }
    , 1000)
}