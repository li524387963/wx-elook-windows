// pages/login/register/register.js
var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth;
var msgCode_URL = getApp().globalData.msgCode_URL;
var register_URL = getApp().globalData.register_URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc:'../../../images/login_icon_4@3x.png',    
    timeText:'获取验证码',
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    width: screenWidth-12,
    tapBL:true,
    password:true,
    Del:'',
    code:'',
    pwd:'',
    second: 60,
    backcolor: 'rgb(41, 182, 216)',
    msgcode:'',

    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(this.data.width)
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
  pwdbind: function (res) {
    console.log(res)
    this.setData({
      pwd: res.detail.value
    })
  },
  lookAction: function (res) {
    console.log(res)
    
    if(this.data.password ==true){
      this.setData({
        password: false,
         imgsrc: '../../../images/login_icon_4_pre@3x.png',

      })
    }else{
      this.setData({
        password: true,
        imgsrc: '../../../images/login_icon_4@3x.png',

      })
    }
  },
  getCode:function(){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.Del.length == 0 ) {
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


       if (this.data.tapBL == true){
         this.setData({
          tapBL :false,
          backcolor: 'rgb(234, 234, 234)'

        });
         countdown(this);
         var data = { phone: this.data.Del}
         this.requestData(msgCode_URL,data)


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
  registerAction:function(){
   
    if (this.data.msgcode!=this.data.code){
      wx.showToast({
        title: '验证码错误',
        image: "../../../images/home_icon_orange@3x.png",
        duration: 2000
      });
    }else if(this.data.pwd.length<6){
      wx.showToast({
        title: '密码少于6位',
        image: "../../../images/home_icon_orange@3x.png",
        duration: 2000
      });
    }else{
      console.log(this.data.pwd)
      var data = { endusername: this.data.Del,enduserpwd:this.data.pwd,aip:'ios'}
      this.requestRegData(register_URL,data)


    }
  },
  requestRegData: function (url, data) {
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
        console.log(that.data.Del)
        console.log(data)
        var userData = JSON.stringify(data);
       
        if (status_code == 10000102) {
          
         
          wx.showToast({
            title: '注册成功',
            icon:'success',
          });
          setTimeout(function () {
           
            wx.hideToast();
            wx.navigateTo({
              
              url: '../addInfo/addInfo?data=' + userData,
            })
            
          }
            , 1000)
          
        }else
        if (status_code == 10000111) {
          wx.showToast({
            title: '已注册',
            image: "../../../images/home_icon_orange@3x.png",
            duration: 2000
          });
        } else
        if (status_code == 10000100) {
          wx.showToast({
            title: '手机号错误',
            image: "../../../images/home_icon_orange@3x.png",
            duration: 2000
          });
        } else
        if (status_code == 10000101) {
          wx.showToast({
            title: '入库失败',
            image: "../../../images/home_icon_orange@3x.png",
            duration: 2000
          });
        } else{
          wx.showToast({
            title: '注册失败',
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
      timeText:'获取验证码'+"("+second+')'
    });
    countdown(that);
  }
    , 1000)
}