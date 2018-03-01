//app.js
App({
  onShow:function(){
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        this.globalData.screenHeight = res.screenHeight;
        this.globalData.screenWidth = res.screenWidth;
        
    
      },
    });
   



  },
  onLaunch: function () {
    // wx.getStorage({
    //   key: 'enduser',
    //   success: function (res) {
    //     console.log(res.data.enduser_phone_name)
    //     wx.reLaunch({
    //       url: 'pages/index/index'
    //     })
    //   },
    //   fail: function (res) {
        
    //     wx.reLaunch({
    //       url: 'pages/login/login'
    //     })
       

    //   },

    // })
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
  // https://www.elook.iego.cn
  // https://iot.xunrun.com.cn
  
    userInfo: null,
    login_URL:'https://iot.xunrun.com.cn/index.php/Admin/manager/login',
    register_URL: 'https://iot.xunrun.com.cn/index.php/Admin/manager/reg',
    msgCode_URL:'https://iot.xunrun.com.cn/index.php/Admin/manager/sendphonemsg',
    addenduserinfo_URL:'https://iot.xunrun.com.cn/index.php/Admin/manager/addenduserinfo',
    backpwd_URL:'https://iot.xunrun.com.cn/index.php/Admin/manager/backpwd',
    advertis_URL: 'https://iot.xunrun.com.cn/index.php/Admin/Advertis/advertis',
    checkin_URL: 'https://iot.xunrun.com.cn/index.php/admin/deviceadd/checkin', 
     checkdev_URL:
'https://iot.xunrun.com.cn/index.php/admin/deviceadd/checkdev',
     service_Url: 'https://iot.xunrun.com.cn/', devtime_Select:'https://iot.xunrun.com.cn/index.php/admin/deviceadd/devtimeselect',
     reportmsg_URL:'https://iot.xunrun.com.cn/index.php/admin/reportmsg/reportmsg',
     deviceadd_URL:'https://iot.xunrun.com.cn/index.php/admin/deviceadd/add',
     getDeviceState_URL:'https://iot.xunrun.com.cn/index.php/Admin/Deviceupd/GetDeviceStateaos',
     setDeviceState_URL: 'https://iot.xunrun.com.cn/index.php/Admin/Deviceupd/SetDeviceState',
     proposal_URL:'https://iot.xunrun.com.cn/index.php/Admin/proposal/proposal',
     devupdown_URL:'https://iot.xunrun.com.cn/index.php/Admin/devupdown/updown',
     devmsg_URL: 'https://iot.xunrun.com.cn/index.php/admin/deviceadd/devmsg',
     deviceselect_URL: 'https://iot.xunrun.com.cn/index.php/admin/deviceupd/deviceselect',

    screenHeight:null,
    screenWidth:null,

  }
})