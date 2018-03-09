var advertis_URL = getApp().globalData.advertis_URL; 
var checkin_URL = getApp().globalData.checkin_URL; 
var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth;
var devupdown_URL = getApp().globalData.devupdown_URL;
Page({
  // 触摸开始时间
  touchStartTime: 0,
  // 触摸结束时间
  touchEndTime: 0,  
  /**
   * 页面的初始数据
   */
  data: {
    adImageUrl:[],
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    infoone:[],
    infotwo:[],
    infothree:[],
    text1:"7",
    page: 1,
    pagenum: 1,
    current:0,
    phone:'',
    uid:'',
    touchStartTime: 0,
    touchEndTime: 0, 
  },

  /**
   * 生命周期函数--监听页面加载1
   */
  onLoad: function (options) {
   // 
   // this.requestValueData();
   
    
   
  },
  requestAdData:function(){
    var that = this
    
    wx.request({

      url: advertis_URL,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { endusername: that.data.phone, aip: "aip" },
      success: function (res) {
        
         console.log(res.data)
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        that.setData({
          adImageUrl: res.data.UserInfo.ret.data
          


        })
        // console.log(res.data.UserInfo.ret.data)
      },

      fail: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新啊实打实
      }

    }) 

  },
  requestValueData:function(){
    var that = this
    wx.showLoading({
      title: '加载中...',
      icon: "loading",
      duration: 10000
    })
    wx.request({
      

      url: checkin_URL,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { enduserid: that.data.uid, aip: "ios", page: "1" },
      success: function (res) {
        console.log(res)

        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        that.setData({
          infotwo: res.data.UserInfo.ret.infotwo,
          infoone: res.data.UserInfo.ret.infoone,
          pagenum: res.data.UserInfo.ret.pagenum,

        })
        if (res.data.UserInfo.ret.ret_message == "empty") {
          wx.showToast({
            title: '暂无数据',
            icon: "success",
            duration: 2000
          })
          that.setData({
            infotwo: [],
            infoone: [],
            pagenum: 0,

          })
        } else {
          console.log(res.data.UserInfo.ret)

          for (var i = 0; i < res.data.UserInfo.ret.infoone.length; i++){
            res.data.UserInfo.ret.infoone[i].access_value = '00000'
            res.data.UserInfo.ret.infoone[i].yesterday = '无'
            res.data.UserInfo.ret.infoone[i].weekvalue = '无'
            for (var j = 0; j < res.data.UserInfo.ret.infotwo.length; j++) {
              if (res.data.UserInfo.ret.infoone[i].device_device_id == res.data.UserInfo.ret.infotwo[j].access_device_id){
               
                if (res.data.UserInfo.ret.infotwo[j].yesterday == null) {
                res.data.UserInfo.ret.infotwo[j].yesterday = '无'
                }
                if (res.data.UserInfo.ret.infotwo[j].weekvalue == null) {
                  res.data.UserInfo.ret.infotwo[j].weekvalue = '无'
                }
                res.data.UserInfo.ret.infoone[i].yesterday = res.data.UserInfo.ret.infotwo[j].yesterday;
                res.data.UserInfo.ret.infoone[i].weekvalue = res.data.UserInfo.ret.infotwo[j].weekvalue;

                
                res.data.UserInfo.ret.infoone[i].access_value = parseInt(res.data.UserInfo.ret.infotwo[j].access_value) + parseInt(res.data.UserInfo.ret.infoone[i].access_value) ;
                
                res.data.UserInfo.ret.infoone[i].access_value = res.data.UserInfo.ret.infoone[i].access_value.toString()
                console.log(res.data.UserInfo.ret.infoone[i].access_value)
                

                switch (res.data.UserInfo.ret.infoone[i].access_value.length) {

                  case 1:

                    res.data.UserInfo.ret.infoone[i].access_value = '0000' + res.data.UserInfo.ret.infoone[i].access_value

                    break;
                  case 2:

                    res.data.UserInfo.ret.infoone[i].access_value = '000' + res.data.UserInfo.ret.infoone[i].access_value

                    break;
                  case 3:
                    res.data.UserInfo.ret.infoone[i].access_value = '00' + res.data.UserInfo.ret.infoone[i].access_value

                    break;
                  case 4:

                    res.data.UserInfo.ret.infoone[i].access_value = '0'+res.data.UserInfo.ret.infoone[i].access_value

                    break;
                  case 5:

                    res.data.UserInfo.ret.infoone[i].access_value =  res.data.UserInfo.ret.infoone[i].access_value

                    break;
                }
                


              //  switch (res.data.UserInfo.ret.infotwo[j].access_value.length) {

              //   case 1:
                 
              //      res.data.UserInfo.ret.infoone[i].access_value ='000' + res.data.UserInfo.ret.infotwo[j].access_value

              //     break;
              //   case 2:
                  
              //      res.data.UserInfo.ret.infoone[i].access_value ='00' + res.data.UserInfo.ret.infotwo[i].access_value

              //     break;
              //   case 3:
              //      res.data.UserInfo.ret.infoone[i].access_value ='0' + res.data.UserInfo.ret.infotwo[j].access_value
                  
              //     break;
              //   case 4:
                
              //      res.data.UserInfo.ret.infoone[i].access_value =res.data.UserInfo.ret.infotwo[j].access_value
                
              //     break;
              // }

              }

          }
        }
          console.log(res.data.UserInfo.ret.infoone)
          that.setData({
            infoone: res.data.UserInfo.ret.infoone

          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }

    }) 

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
    console.log('onReady')
    
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
          phone: res.data.enduser_phone_name,
          uid: res.data.enduser_enduser_id
        })
        that.requestValueData();

        setTimeout(function () {

          that.requestAdData();

        }
          , 100)


      },
      fail: function (res) {
        wx.reLaunch({
          url: '../login/login'
        })
        wx.clearStorage()


      },

    })
    


   
  },
  stateTap:function(res){
    console.log(res)
    var state = res.target.dataset.model.device_dev_state
    var deviceid = res.target.dataset.model.device_device_id
   
    var deviceModel = JSON.stringify(res.target.dataset.model)
    console.log(deviceModel)
    wx.navigateTo({
       url: 'configDevice/configDevice?deviceModel=' + deviceModel
    })
  },
  addAction:function(res){

    wx.switchTab({
      url: '../scan/scan',
    })
  
  },
  touchstart:function(e){
    
    this.touchStartTime = e.timeStamp
  
  },
  touchend:function(e){
   
    this.touchEndTime = e.timeStamp
  },
  navigatorAction:function(res){
    var that = this
 
    

    if (that.touchEndTime - that.touchStartTime <350){
     
      console.log(res)
      var deviceModel = JSON.stringify(res.currentTarget.dataset.model)

      wx.navigateTo({
        url: 'deviceDetail/deviceDetail?deviceModel=' + deviceModel,
      })
    }

   
  },
  bindlongtap:function(res){
    console.log(res)
    wx.vibrateLong({
      
    })
    var deviceid = res.currentTarget.dataset.model.device_device_id;
    console.log(deviceid)
   var that = this
    
    wx.showModal({
      
      content: '解除设备',
      success: function (res) {
        if(res.confirm){
          console.log(deviceid)
          var data = { endusername: that.data.phone, deviceid: deviceid,aip:'ios'}
          that.requestDeleteData(devupdown_URL,data)

        }
      }
    })
  },
  requestDeleteData: function (url, data) {
    var that = this
    wx.showLoading({
      title: '正在删除...',
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
        console.log(status_code)

        if (status_code == 10005005 || status_code == 10005003) {
          wx.showToast({
            title: '删除成功',
            icon: "success",
          });
          setTimeout(function () {
            wx.hideToast();
            that.requestValueData();
          }, 1500)
         

        } else {
          wx.showToast({
            title: '删除失败',
            image: "../../images/home_icon_orange@3x.png",
            duration: 2000
          });
        }


      },

      fail: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
          title: '删除失败',
          image: "../../images/home_icon_orange@3x.png",
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
    wx.showNavigationBarLoading();
    this.requestAdData();
    this.requestValueData();
    
  },
  bindscrolltolower: function (res) {
    console.log(res)
    var that = this;
    if (that.data.page < that.data.pagenum) {
      that.data.page++;
      var data = { enduserid: that.data.uid, aip: "ios", page: that.data.page };
      wx.request({

        url: checkin_URL,
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: data,

        success: function (res) {
          wx.hideLoading();
          var contentListone = [];
          var contentListtwo = [];
            contentListone = that.data.infoone.concat(res.data.UserInfo.ret.infoone);
          contentListtwo = that.data.infoone.concat(res.data.UserInfo.ret.infotwo);
          that.setData({
            infotwo: contentListtwo,
            infoone: contentListone,
          })
          console.log(res.data.UserInfo.ret)
          for (var i = 0; i < contentListone.length; i++) {
            for (var j = 0; j < contentListtwo.length; j++) {
              if (contentListone[i].device_device_id == contentListtwo[j].access_device_id) {

                if (contentListtwo[j].yesterday == null) {
                  contentListtwo[j].yesterday = '无'
                }
                if (contentListtwo[j].weekvalue == null) {
                  contentListtwo[j].weekvalue = '无'
                }
                contentListone[i].yesterday = contentListtwo[j].yesterday;
                contentListone[i].weekvalue = contentListtwo[j].weekvalue;
                switch (contentListtwo[j].access_value.length) {

                  case 1:

                    contentListone[i].access_value = '000' + contentListtwo[j].access_value

                    break;
                  case 2:

                    contentListone[i].access_value = '00' + contentListtwo[i].access_value

                    break;
                  case 3:
                    contentListone[i].access_value = '0' + contentListtwo[j].access_value

                    break;
                  case 4:

                    contentListone[i].access_value = contentListtwo[j].access_value
                  default:
                    break;
                }

              }

            }
          }
          
          console.log(contentListone)
          that.setData({
            infoone: contentListone
          })
        },
        fail: function () {
          wx.hideLoading();
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }
      })

    } else {
      wx.showToast({
        title: '全部已加载',
        icon: "success",
        duration: 1000
      })
    }
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
