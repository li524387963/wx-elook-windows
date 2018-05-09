// pages/index/deviceSet/deviceSet.js
var screenHeight = getApp().globalData.screenHeight;
var screenWidth = getApp().globalData.screenWidth;
var devmsg_URL = getApp().globalData.devmsg_URL;
var deviceselect_URL = getApp().globalData.deviceselect_URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceModel:{},
    deviceid:'',
    screenHeight: screenHeight,
    screenWidth: screenWidth,
    width: screenWidth - 12,
    delayArray: ['常规模式——1天一次', '省电模式——3天一次', '超省电模式——6天一次'],
    index:0,
    up_delay:'',
    reg_time:'',
    pay_id:'',
    alisPlace:'',
    alis:'',
    alisStr:'',
    checked:false,
    upl_state:'0',
    location:'',
    page:'',
    pickArray: ['正常', '显示图片', '显示log','全部'],
    imgIndex:0,
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")


    // let deviceModel = JSON.parse(options.deviceModel);
    // this.setData({ deviceModel: deviceModel });
    console.log(options)
  //  wx.setNavigationBarTitle({ title: this.data.deviceModel.device_device_id })

    this.setData({ deviceid: options.deviceid, page: options.page});
    wx.setNavigationBarTitle({ title: this.data.deviceid })
    var data = { deviceid: this.data.deviceid }
   
    // var data = { deviceid: this.data.deviceModel.device_device_id}


    this.requestdeviceModel(deviceselect_URL, data)

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
  bindPickerChange:function(e){
    console.log(e.detail.value)
    this.setData({
      index: e.detail.value
    })
    var that = this
    switch (parseInt(that.data.index) ) {
      case 0:
        that.setData({ up_delay: '1' })
        break;
      case 1:
        that.setData({  up_delay: '3' })
        break;
      case 2:
        that.setData({  up_delay: '6' })
       
        break;

     
    }
    console.log(that.data.up_delay)
   
    
  },
  imgpickerChange:function(e){
    console.log(e.detail.value)
    this.setData({
      imgIndex: e.detail.value
    })
    var that = this
    switch (parseInt(that.data.imgIndex)) {
      case 0:
        that.setData({ upl_state: '0' })
        break;
      case 1:
        that.setData({ upl_state: '1' })
        break;
      case 2:
        that.setData({ upl_state: '2' })
        break;
      case 3:
        that.setData({ upl_state: '3' })
        break;


    }
    console.log(that.data.upl_state)
  },
  requestdeviceModel: function (url, data) {
    var that = this
    wx.showLoading({
      title: '加载中...',
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
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
       console.log(res)
       var dateStr = res.data.UserInfo.info.device_reg_time.substr(0, 16) 
       var alisStr = res.data.UserInfo.info.device_alias
       that.setData({
         alisStr: alisStr})
       if(alisStr==null){
         var alis =  res.data.UserInfo.info.device_device_id.substr(5,4)
         var alisPlace = alis +'(可修改)'
         that.setData({ alisPlace: alisPlace, alis: alis})

       }else{
         that.setData({ alis: res.data.UserInfo.info.device_alias })
       }
       var checkStr = res.data.UserInfo.info.device_upl_state
      //  if (checkStr==null){
      //    that.setData({ checked: false, upl_state:'0' })
      //  } else if (checkStr =='0'){
      //    that.setData({ checked: false, upl_state: '0' })
      //  }else{
      //    that.setData({ checked: true, upl_state: '1' })
      // }
       
         if (checkStr==null){
           that.setData({ imgIndex: 0, upl_state:'0' })
       } else if (checkStr =='0'){
           that.setData({ imgIndex: 0, upl_state: '0' })
         } else if (checkStr == '1'){
           that.setData({ imgIndex: 1, upl_state: '1' })
         } else if (checkStr == '2') {
           that.setData({ imgIndex: 2, upl_state: '2' })
         }
         else if (checkStr == '3') {
           that.setData({ imgIndex: 3, upl_state: '3' })
         }
           
       var locaStr = res.data.UserInfo.info.device_location
      
       if (locaStr==null){
         var loactionStr = '暂无位置信息'
   
         that.setData({ location: loactionStr })    

       }else{
     
         that.setData({ location: res.data.UserInfo.info.device_location }) 
       }

       var delay = parseInt(res.data.UserInfo.info.device_up_delay)
       switch (delay) {
         case 1:
           that.setData({ index: 0, up_delay:'1'}) 
           break;
         case 3:
           that.setData({ index: 1, up_delay: '3'}) 
           break;
         case 6:
           that.setData({ index: 2, up_delay: '6'}) 
           break;

         default:
           break;
       }


       that.setData({ reg_time: dateStr, pay_id: res.data.UserInfo.info.device_pay_id, deviceModel: res.data.UserInfo.info});

        

       


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

  nameBindinput:function(res){
    this.setData({
      alis: res.detail.value
    })
  },
  locaBindinput:function(res){
  //  wx.navigateTo({
  //    url: '../map/map',
  //  })
  var that= this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          location: res.name
        })
      },
    })
  },
  switchLimit:function(res){
    console.log(res)
      this.setData({
        checked: res.detail.value,
       
      })
      if (this.data.checked==true){
        this.setData({
          upl_state: "1",

        })
      }else{
        this.setData({
          upl_state: "0",

        })
      }
    console.log(this.data.upl_state)
   
  },
  setAction:function(){



   
    console.log(this.data.pay_id, this.data.deviceModel.device_pay_id, this.data.alis, this.data.deviceModel.device_alias, this.data.upl_state, this.data.deviceModel.device_upl_state, this.data.location, this.data.deviceModel.device_location, this.data.up_delay, this.data.deviceModel.device_up_delay)
    console.log(this.data.alis.length)
  if(this.data.alis.length == 0){
    wx.showToast({
      title: '昵称不能为空',
      duration:2000,
      image: "../../../images/home_icon_orange@3x.png",
    })

  }else{


    if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay){

      if (this.data.page == 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.switchTab({
          url: '../index',
        })
      }
     

    }else{
      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay){
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, delay: this.data.up_delay,aip:'ios'}
        console.log(dataStr)
      }
      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, location: this.data.location, aip: 'ios' }
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, location: this.data.location, delay: this.data.up_delay,aip: 'ios', }
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, state: this.data.upl_state, aip: 'ios' }
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, state: this.data.upl_state, delay: this.data.up_delay, aip: 'ios', }
        console.log(dataStr)
      }
      
      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, state: this.data.upl_state, location: this.data.location, aip: 'ios', }
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, state: this.data.upl_state, location: this.data.location, aip: 'ios', delay: this.data.up_delay,}
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, alias: this.data.alis, aip: 'ios' }
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, alias: this.data.alis, delay: this.data.up_delay, aip: 'ios', }
        console.log(dataStr)
      }
      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, alias: this.data.alis, location: this.data.location, aip: 'ios', }
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, alias: this.data.alis, location: this.data.location, aip: 'ios', delay: this.data.up_delay, }
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, alias: this.data.alis, state: this.data.upl_state, aip: 'ios', }
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, alias: this.data.alis, state: this.data.upl_state, aip: 'ios', delay: this.data.up_delay, }
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, alias: this.data.alis, state: this.data.upl_state, aip: 'ios', location: this.data.location, }
        console.log(dataStr)
      }

      if (this.data.pay_id == this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, alias: this.data.alis, state: this.data.upl_state, aip: 'ios', location: this.data.location, delay: this.data.up_delay }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios' }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', delay: this.data.up_delay}
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', location: this.data.location }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', location: this.data.location, delay: this.data.up_delay}
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', state: this.data.upl_state }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', state: this.data.upl_state, delay: this.data.up_delay }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', state: this.data.upl_state, location: this.data.location }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis == this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', state: this.data.upl_state, location: this.data.location, delay: this.data.up_delay}
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', alias: this.data.alis }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', alias: this.data.alis, delay: this.data.up_delay }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', alias: this.data.alis, location: this.data.location }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state == this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', alias: this.data.alis, location: this.data.location, delay: this.data.up_delay }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', alias: this.data.alis, state: this.data.upl_state }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location == this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', alias: this.data.alis, state: this.data.upl_state, delay: this.data.up_delay}
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay == this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', alias: this.data.alis, state: this.data.upl_state, location: this.data.location }
        console.log(dataStr)
      }

      if (this.data.pay_id != this.data.deviceModel.device_pay_id && this.data.alis != this.data.deviceModel.device_alias && this.data.upl_state != this.data.deviceModel.device_upl_state && this.data.location != this.data.deviceModel.device_location && this.data.up_delay != this.data.deviceModel.device_up_delay) {
        var dataStr = { deviceid: this.data.deviceModel.device_device_id, payid: this.data.pay_id, aip: 'ios', alias: this.data.alis, state: this.data.upl_state, location: this.data.location, delay: this.data.up_delay}
        console.log(dataStr)
      }
      this.postData(devmsg_URL,dataStr)
    }

  }


  },
  postData: function (url, data) {
    var that = this
    wx.showLoading({
      title: '保存中...',
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
        var status_code = res.data.UserInfo.ret.status_code;
        let deviceModel = JSON.stringify(res.data.UserInfo.ret.data);

        if (status_code === 10001118) {
          wx.showToast({
            title: '保存成功',
            icon: "success",
            
          });
          setTimeout(function () {
            wx.hideToast();
            if(that.data.page ==1){
              wx.navigateBack({
                delta: 1
              })
            }else{
              wx.switchTab({
                url: '../index',
              })
            }

            
          }, 1500)




        } else  {
          wx.showToast({
            title: '保存失败',
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