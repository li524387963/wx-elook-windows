// pages/index/deviceInfo/deviceInfo.js
var screenHeight = getApp().globalData.screenHeight;
var deviceadd_URL = getApp().globalData.deviceadd_URL;
var screenWidth = getApp().globalData.screenWidth;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeText:'智能水表',
    typeIdText:'水表记录仪标号 :  ....',
    deviceid:"",
    screenHeight: screenHeight,
    endusername:'',
    


  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var type = options.deviceid.substring(0, 1);
   // if(type==1){
      this.setData({
        typeText: '智能水表',
        typeIdText: '水表记录仪标号:' + options.deviceid,
        deviceid: options.deviceid,
      })
  //  }
   
    
  
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
   var that = this;
    wx.getStorage({
      key: 'enduser',
      success: function (res) {
        console.log(res.data)
        that.setData({
          endusername: res.data.enduser_phone_name,
          
        })
        


      },

    })
  },
  scanTap: function () {
    wx.scanCode({
      success: (res) => {
        var type = res.result.substring(0, 1);
        console.log(res.result.substring(0, 1))
        if (res.result.length === 9 && (type == 1 || type == 2)) {
          this.setData({
            typeText: '智能水表',
            typeIdText: '水表记录仪标号:' + res.result,
            deviceid: res.result,
          })

        } else {
          wx.showToast({
            title: '设备信息错误,请重新扫描',
            icon: 'cancel',
            duration: 2000
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '扫码错误',
          icon: 'cancel',
          duration: 2000
        })
      }

    })
  },
  bindView:function(){
     var data = { endusername: this.data.endusername, deviceid: this.data.deviceid, devicetype: 1, delay:1};
    this.requestData(deviceadd_URL,data)

  },
  requestData: function (url, data) {
    var that = this
    wx.showLoading({
      title: '添加中...',
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
        var status_code = res.data.UserInfo.ret.status_code;
        let deviceModel = JSON.stringify(res.data.UserInfo.ret.data);

        if (status_code === 10000312) {
          if (res.data.UserInfo.ret.data.device_dev_state==5){
            wx.navigateTo({
              url: '../bindSuccess/bindSuccess?deviceModel=' + deviceModel,
            
            })
          }else{
            wx.navigateTo({
              url: '../configDevice/configDevice?deviceModel=' + deviceModel
            })
          }


          
          

        } else if (status_code === 10000313){
          wx.showToast({
            title: '重复绑定',
            image: "../../../images/home_icon_orange@3x.png",
            duration: 2000
          });
        } else if (status_code === 10000307) {
          wx.showToast({
            title: '设备未授权',
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