// pages/index/configDevice/configDevice.js
var imgtimer; // 计时器
var processTimer; // 计时器
var stateOneTimer; 

var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth ;
var getDeviceState_URL = getApp().globalData.getDeviceState_URL;
var setDeviceState_URL = getApp().globalData.setDeviceState_URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc:'../../../images/icon_layer1@3x.png',
    
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    width: screenWidth-40,
    deviceModel:{},
     count : 0,
   
    processTimer:null,
    stateOneTimer:null,
    getStateTimer:null,
    disabled:false,
    text: "正在等待配置...",
    
    btText:'开始配置',
    state:'',
    oneCount:0,
    getStateCount:0,
    percent: 0,
    loading: false,


   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
   
    let deviceModel = JSON.parse(options.deviceModel);
    this.setData({ deviceModel: deviceModel });
    
  
   
    //  var that = this;
     
   
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
   
    var data = this.data.deviceModel.device_device_id + '1'
    console.log(data)
    this.setData({
      
      percent: 0,
      count: 0,
    })
    this.requestdeviceStateText(getDeviceState_URL, data)
    
   
    
  },
  
  requestdeviceStateText: function (url, data) {
    var that = this
    wx.showLoading({
      title: '请求中...',
      icon: "loading",
      duration: 1000
    })
    wx.request({

      url: url,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: data,
      success: function (res) {
      
        var dataStr = res.data.substr (2,1) 
       
        that.setData({
          state: dataStr,
         
        })
    
        switch (dataStr) {
          case '0':
           
            that.setData({
              text : "请开启设备,准备配置"
            })
            break;
          case '1':
            that.setData({
             text : "设备未配置,请重启设备后点击开始配置"
            })
           
            break;
          case "2":
            that.setData({
              text : "连接服务器失败,请重启设备后点击开始配置"
            })
            console.log(dataStr)
            
            break;
          case '4':
            that.setData({
              text : "解析失败,请重启设备后点击开始配置"
            })
         
            break;
          case '5':
            that.setData({
              text : "配置成功"
            })
            
            break;
          case '6':
            that.setData({
              text : "无法解析,请重启设备后点击开始配置"
            })
           
            break;
          case '9':
            that.setData({
              text : "配置成功"
            })
            break;
          case 'A':
            that.setData({
              text : "配置成功"
            })
            break;

          default:
            break;
        }


      },

      fail: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
          title: '网络连接失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
      }

    })

  },
  startAction: function () {
   
    this.setProcess();
    this.setData({
      disabled: true,
      loading: true,
      btText: '配置中...',
      
      
      

    })
    Countdown(this);
    switch (this.data.state) {
      case '0':
        console.log(this.data.state)
        this.connectNetWork();
       
        break;
      case '1':
        console.log(this.data.state)
        this.setStateAction();

        break;
      case "2":
        
        console.log(this.data.state)
        this.setStateAction();

        break;
      case '4':
        console.log(this.data.state)
        this.setStateAction();

        break;
      case '5':
        console.log(this.data.state)
        this.bindSuccess();

        break;
      case '6':
        console.log(this.data.state)
        this.setStateAction();
        break;
      case '9':
        console.log(this.data.state)
        this.bindSuccess();
        break;
      case 'A':
        console.log(this.data.state)
        this.bindSuccess();
        break;

      default:
        break;
    }
   
  },
  //getState 1
  connectNetWork:function(){
    var that = this
    that.setData({ text: "正在连接服务器..." })
    that.data.stateOneTimer = setInterval(function () {

      that.data.oneCount++;
      that.setData({ oneCount: that.data.oneCount })
      if (that.data.oneCount > 20) {
        //超时
        clearInterval(that.data.stateOneTimer)
        that.bindFail();
      }else{

        that.queryState()
      }


    }, 3000)
  },
  queryState:function(){
    var that = this
    wx.request({

      url: getDeviceState_URL,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: that.data.deviceModel.device_device_id + '1',
      success: function (res) {
       

        var dataStr = res.data.substr(2, 1)
        console.log(dataStr)
        if (dataStr === '1'){
          console.log(111111)
          clearInterval(that.data.stateOneTimer)
          that.setStateAction()


        }
      

      },

      fail: function () {
        clearInterval(that.data.stateOneTimer)
        wx.showLoading({
          title: '网络连接失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
      }

    })
  },
  setStateAction:function(){
    var that = this
    that.setData({ text: "设备与服务器连接中..." })
    wx.request({

      url: setDeviceState_URL,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: that.data.deviceModel.device_device_id + '12',
      success: function (res) {
        clearInterval(that.data.stateOneTimer)

        var dataStr = res.data.substr(2, 1)
        console.log(dataStr)
        if (dataStr === 'E') {
         //设备不存在
        
          wx.showToast({
            title: '设备不存在',
            image: "../../../images/home_icon_orange@3x.png",
            duration: 2000
          });
         


        }else{
          that.getDeviceState();


        }


      },

      fail: function () {
        clearInterval(that.data.stateOneTimer)
        wx.showToast({
          title: '网络连接失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
      }

    })


  },
  getDeviceState:function(){
    var that = this
    that.setData({ text: "设备正在解析图片..." })
    that.data.getStateTimer = setInterval(function () {

      that.data.getStateCount++;



      that.setData({ getStateCount: that.data.getStateCount })
      if (that.data.getStateCount > 24) {
        clearInterval(that.data.getStateTimer)
        //超时
        that.bindFail();
      } else {
        that.reciveStateData()
      }


    }, 3000)
  },
  reciveStateData:function(){
    var that = this
    wx.request({

      url: getDeviceState_URL,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: that.data.deviceModel.device_device_id + '1',
      success: function (res) {


        var dataStr = res.data.substr(2, 1)
        var countStr = res.data.substr(3, 1)

        console.log(dataStr, countStr)
        if (dataStr != '2') {
          console.log("dataStr != '2'")
          clearInterval(that.data.getStateTimer)
          if (dataStr == "5"){
            //配置成功
            that.bindSuccess();


          }
          if (dataStr == "9") {
            //配置成功
            that.bindSuccess();
          }
          if (dataStr == "A") {
            //配置成功
            that.bindSuccess();
           

          }
          if (dataStr == "4") {
            //配置失败
            that.bindFail();

          }
         

        }else{
          //查询次数
          var cStr = "设备与服务器连接次数:"+countStr+'次'

          that.setData({ text: cStr })

        }


      },

      fail: function () {
        clearInterval(that.data.getStateTimer)
        wx.showToast({
          title: '网络连接失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
      }

    })
  },
  bindSuccess:function(){
    
   var that = this
   that.setData({
     text: "解析成功", percent: 100,})
    wx.navigateTo({
    //  url: '../bindSuccess/bindSuccess',
      url: '../deviceSet/deviceSet?deviceid=' + this.data.deviceid,
      url: '../deviceSet/deviceSet?deviceid=' + this.data.deviceid + '&page=' + 0,
      success: function () {
        that.setData({
          disabled: false, btText: '开始配置', oneCount: 0,
          getStateCount: 0,
         
          loading: false,
        })
       
      }
    })
  },
  bindFail:function(){
    var that = this
    that.setData({
      text: "解析失败", percent: 100,
    })
    wx.navigateTo({
      url: '../bindFail/bindFail?deviceid=' + that.data.deviceModel.device_device_id,
      success:function(){
        that.setData({
           disabled: false, btText: '开始配置', oneCount: 0,
          getStateCount: 0,
        
          loading: false, })
       
      }
        
      
    })
  },

  //
  setProcess:function(){
    var that = this;
      that.processTimer = setInterval(function () {

      that.data.percent++;



      that.setData({ percent: that.data.percent })
      if (that.data.percent > 90) {
        clearInterval(that.processTimer)
      }


    }, 1500)
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(imgtimer);
    clearInterval(this.data.stateOneTimer)
    clearInterval(this.data.processTimer)
    clearInterval(this.data.getStateTimer)
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(imgtimer);
    clearInterval(this.data.stateOneTimer)
    clearInterval(this.data.processTimer)
    clearInterval(this.data.getStateTimer)
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
// 倒计时
function Countdown(that) {
  that.data.count++;
  //console.log(count)
  imgtimer = setTimeout(function () {
   // console.log("----Countdown----");
   
    switch (that.data.count){
      case 1:
        that.setData({
          imgSrc: '../../../images/icon_layer2@3x.png'
        });
      break;
      
      case 2:
        that.setData({
          imgSrc: '../../../images/icon_layer3@3x.png'
        });
        break;
      case 3:
        that.setData({
          imgSrc: '../../../images/icon_layer4@3x.png'
        });
        break;
      case 4:
        that.setData({
          imgSrc: '../../../images/icon_layer1@3x.png'
        });
        that.data.count=1;
        break;
      default:
        break;

    }
    Countdown(that);
   
  }, 250);
};
