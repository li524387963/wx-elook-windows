var wxCharts = require('../../../utils/wxcharts.js');
var util = require('../../../utils/util.js'); 
var app = getApp();
var areaChart = null;
var windowWidth = getApp().globalData.screenWidth;
var screenHeight = getApp().globalData.screenHeight;
var columnChart = null;
var reportmsg_URL = app.globalData.reportmsg_URL;
var setDeviceState_URL = getApp().globalData.setDeviceState_URL;
var chartData = {
  main: {

    data: [1,-1115 , 6, 5],
    categories: ['11/20-11/26', '11/20-11/26', '09月', '2016']
  },

};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: windowWidth - 12 - 200 - 80-12 ,
    windowWidth: 320,
    screenWidth: windowWidth,
    screenHeight: screenHeight,
    
    areaHide: false,
    columnHide: false,
    monthHide: false,
    yearHide:false,
    radioValues: [
      { 'value': '日', 'selected': true },
      { 'value': '周', 'selected': false },
      { 'value': '月', 'selected': false },
      { 'value': '年', 'selected': false },
    ],
    clazz:[],
    deviceid:null,
    yearvalue:[],
    yearDate:[],
    dayvalue:[],
    dayDate:[],
    monthvalue:[],
    monthDate:[],
    weekvalue:[],
    weekDate:[],
    deviceModel:{},
    lastIndex:6,
    accessday:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  console.log(options)
    let deviceModel = JSON.parse(options.deviceModel);
    this.setData({ deviceid: deviceModel.device_device_id, deviceModel: deviceModel });
    // this.setData({
    //   deviceid: options.deviceId
    // })
 
    this.clazzStatus();
    var data = { deviceid: this.data.deviceid }
    wx.setNavigationBarTitle({ title: this.data.deviceid })
    this.request(reportmsg_URL,data)
    
  
    
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
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      var windowWidth = res.windowWidth;
      this.setData({
        windowWidth: windowWidth
      })
      
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    const ctx = wx.createCanvasContext('bgCanvas')

    // Create linear gradient
    const grd = ctx.createLinearGradient(windowWidth / 2, 0, windowWidth / 2, 180)
    grd.addColorStop(0, 'rgb(0,179,211)')
    grd.addColorStop(0.5, 'rgb(0,107,166)')
    grd.addColorStop(1, 'rgb(1,29,89)')

    // Fill with gradient
    ctx.setFillStyle(grd)
    ctx.fillRect(0, 0, windowWidth, 180)
    ctx.draw()


  
    
  },
  bindTap:function(){
   
    
    // wx.navigateTo({
    //   url: '../bindFail/bindFail?deviceid=' + this.data.deviceModel.device_device_id + '&page=' + 1,
    // })
    //重新设置2 继续绑定
var that = this
    wx.showModal({
      title: '提示',
      content: '是否重新配置设备',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setStateAction();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })



    

  },
  setStateAction: function () {
    var that = this
    wx.showLoading({
      title: '设置中...',
      icon: "loading",
      duration: 10000
    })
    wx.request({

      url: setDeviceState_URL,
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: that.data.deviceModel.device_device_id + '12',
      success: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新

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



        } else {
          var deviceModel = JSON.stringify(that.data.deviceModel)
        wx.navigateTo({
      //  url: '../bindFail/bindFail?deviceid=' + that.data.deviceModel.device_device_id + '&page=' + 1,
          url: '../configDevice/configDevice?deviceModel=' + deviceModel ,


     })


        }


      },

      fail: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        clearInterval(that.data.stateOneTimer)
        wx.showToast({
          title: '网络连接失败',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });
      }

    })


  },
  setAction:function(){
    var deviceModel = JSON.stringify(this.data.deviceModel)
    // wx.navigateTo({
    //   url: '../deviceSet/deviceSet?deviceModel=' + deviceModel,
    // })
     wx.navigateTo({
       url: '../deviceSet/deviceSet?deviceid=' + this.data.deviceid+'&page='+1
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
    
  },
  indexChanged: function (e) {
    // 点中的是组中第个元素
    var index = e.target.dataset.index;
    // 读取原始的数组
    var radioValues = this.data.radioValues;
    for (var i = 0; i < radioValues.length; i++) {
      // 全部改为非选中
      radioValues[i].selected = false;
      // 当前那个改为选中
      radioValues[index].selected = true;
    }
    // 写回数据
    this.setData({
      radioValues: radioValues
    });
    // clazz状态
    this.clazzStatus();
    switch(index){
      case 0:
        this.dayTap();
        

       break;
      case 1:
        this.weekTap();
      break;
      case 2:
        this.monthTap();
      break;
      case 3:
        this.yearTap();

      break;
      
      default:
        break;
    }


  },
  clazzStatus: function () {
    /* 此方法分别被加载时调用，点击某段时调用 */
    // class样式表如"selected last","selected"
    var clazz = [];
    // 参照数据源
    var radioValues = this.data.radioValues;
    for (var i = 0; i < radioValues.length; i++) {
      // 默认为空串，即普通按钮
      var cls = '';
      // 高亮，追回selected
      if (radioValues[i].selected==true) {
        cls += 'selected ';
      }
      // 最后个元素, 追加last
      if (i == radioValues.length - 1) {
        cls += 'last ';
      }
      //去掉尾部空格
      cls = cls.replace(/(\s*$)/g, '');
      clazz[i] = cls;
    }
    // 写回数据
    this.setData({
      clazz: clazz
    });
    
  },
  touchHandler: function (e) {
    console.log(e)
    console.log(areaChart.getCurrentDataIndex(e));
    var index = areaChart.getCurrentDataIndex(e);
    areaChart.showToolTip(index);
   // var lastindex = index ;
   console.log(this.data.dayvalue)
    if (index == this.data.lastIndex){
      console.log(index, this.data.lastIndex)
      if (this.data.dayvalue[index]!=null){
        wx.navigateTo({
          url: '../allDeviceData/allDeviceData?deviceId=' + this.data.deviceid + '&currentTime=' + this.data.accessday[index]

       })
        console.log(this.data.dayvalue[index], "跳转", this.data.accessday[index])
      }
    }else{
      console.log(index, this.data.lastIndex,'buyiyang')
    }
    this.setData({
      lastIndex:index
    })

  }, 
  areaChart: function (windowWidth) {
    var max = Math.max.apply(Math, this.data.dayvalue);
   
    areaChart = new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      background: 'red',
      categories: this.data.dayDate,
      
      animation: true,
      
      series: [{

        data: this.data.dayvalue,
        //data: [9, 88, 889, 4321, 98765,-66666,-99999],
      
        format: function (val) {
          return val.toFixed(0);
        },
        color: 'black',

      }],
      
      yAxis: {

        format: function (val) {
          return val.toFixed(0);
        },
        min: 0,
        max:max/4+max,
       
        fontColor: 'white',
        gridColor: 'white',
        titleFontColor: '#f7a35c'
      },
      xAxis: {
        fontColor: 'white',
        gridColor: '#7cb5ec',
        disableGrid: true,
      },
      extra: {
        legendTextColor: '#cb2431'
      },
      width: windowWidth,

      height: 200,



    });
   
    setTimeout(function () {
      areaChart.showToolTip(6);
    }, 1200);
  },
  columnChart: function (windowWidth) {
    var max = Math.max.apply(Math, this.data.weekvalue);
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,

      categories: this.data.weekDate,
      series: [{

        color: 'white',
        data: this.data.weekvalue,
   
        format: function (val, name) {
          return val.toFixed(0);
        }
      }],
      yAxis: {
        format: function (val) {
          return val.toFixed(0);
        },
        fontColor: 'white',
        gridColor: 'white',
        titleFontColor: '#f7a35c',
        min: 0,
        max:max/4+max,
        
       
      },
      xAxis: {
        fontColor: 'white',
        gridColor: '#7cb5ec',
        disableGrid: true,
        // type: 'calibration'
      },
      extra: {
        column: {
          width: 18
        }
      },
      width: windowWidth,
      height: 200,
    });
  },
  yearChart: function (windowWidth) {
    var max = Math.max.apply(Math, this.data.yearvalue);
    columnChart = new wxCharts({
      canvasId: 'yearCanvas',
      type: 'column',
      animation: true,

      categories:  this.data.yearDate,
      series: [{

        color: 'white',
        data: this.data.yearvalue,
      
        format: function (val, name) {
          return val.toFixed(0);
        }
      }],
      yAxis: {
        format: function (val) {
          return val.toFixed(0);
        },
        fontColor: 'white',
        gridColor: 'white',
        titleFontColor: '#f7a35c',
        min: 0,
        max:max,
       
      },
      xAxis: {
        fontColor: 'white',
        gridColor: '#7cb5ec',
        disableGrid: true,
        // type: 'calibration'
      },
      extra: {
        column: {
          width: 18
        }
      },
      width: windowWidth,
      height: 200,
    });
  },
  monthChart: function (windowWidth) {
    var max = Math.max.apply(Math, this.data.monthvalue);
    columnChart = new wxCharts({
      canvasId: 'monthCanvas',
      type: 'column',
      animation: true,

      categories: this.data.monthDate,
      series: [{

        color: 'white',
        data:  this.data.monthvalue,
      
        format: function (val, name) {
          return val.toFixed(0);
        }
      }],
      yAxis: {
        format: function (val) {
          return val.toFixed(0);
        },
        fontColor: 'white',
        gridColor: 'white',
        titleFontColor: '#f7a35c',
        min: 0,
        max:max/4+max,
        
      },
      xAxis: {
        fontColor: 'white',
        gridColor: '#7cb5ec',
        disableGrid: true,
        // type: 'calibration'
      },
      extra: {
        column: {
          width: 18
        }
      },
      width: windowWidth,
      height: 200,
    });
  },
  dayTap: function () {
    this.setData({
      areaHide: false,
      columnHide: true,
      monthHide:true,
      yearHide:true,
    })
    this.areaChart(windowWidth);

  },
  weekTap: function () {
    this.setData({
      areaHide: true,
      columnHide: false,
      monthHide: true,
      yearHide: true,
    })
    this.columnChart(windowWidth);

  },
  monthTap: function () {
    this.setData({
      areaHide: true,
      columnHide: true,
      monthHide: false,
      yearHide: true,
    })
    this.monthChart(windowWidth);

  },
  
  yearTap: function () {
    this.setData({
      areaHide: true,
      columnHide: true,
      monthHide: true,
      yearHide: false,
    })
    this.yearChart(windowWidth, this.data.yearDate, this.data.yearvalue);

  },
  request: function (url, data) {
    var that = this
   // console.log(data)
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
        console.log(res.data.UserInfo.ret.data)
       
        var dayvalue7 = [];
        var weekvalue7 = [];
        var monthvalue7 = [];
        var yearvalue3=[];
        var i = 0;
        for (var p in res.data.UserInfo.ret.data){
          

          
          if(i==0){
          //  console.log('0')
            dayvalue7 =  res.data.UserInfo.ret.data[p]
          }
          if (i == 1) {
        //    console.log('1')
            weekvalue7 = res.data.UserInfo.ret.data[p]

          }
          if (i == 2) {
         //   console.log('2')
            monthvalue7 = res.data.UserInfo.ret.data[p]

          }
          if (i == 3) {
          //  console.log('3')
            yearvalue3 = res.data.UserInfo.ret.data[p]
          }
          i++
        }
     //   console.log(yearvalue3)
        //日
       var dayDate = [];
       var dayvalue = [];
       var accessday = [];
       for (var i=0; i< dayvalue7.length;i++){
         
        
           dayvalue.push(dayvalue7[i].value);
          
           dayDate.push(formatTime(dayvalue7[i].day, 'M.D'));
           accessday.push(dayvalue7[i].day)
        
         
        }
      // console.log(dayDate, dayvalue);
       dayDate.sort();
       accessday.sort();
       dayvalue.reverse();
       
       var time = util.formatTime1(new Date()); 
       
       if (dayDate[6] === time ){
         dayDate[6]='今日'
       }
   //    console.log(dayDate);
     //  console.log(dayvalue);
      //周
       var weekDate = [];
       var weekvalue = [];
       var weekDate2 = [];
       for (var i = 0; i < weekvalue7.length; i++) {
         if (i < 4) {
         
         weekvalue.push(weekvalue7[i].value);
        
         weekDate.push(formatTime(weekvalue7[i].day, 'M/D'));
         weekDate2.push(formatTime(weekvalue7[i].day + 6 * 24 * 60 * 60, 'M/D'));
         }
       }
     //  console.log(weekDate,weekDate2,weekvalue);
       weekDate.sort();
       weekDate2.sort();
       weekvalue.reverse();
     //  console.log(weekDate, weekDate2, weekvalue);
       var weekDate3 = [];
       for(var i=0;i<weekDate.length;i++){
         weekDate3.push(weekDate[i]+'-'+weekDate2[i])
       }
    //   console.log(weekDate3)

       //月
       var monthDate = [];
       var monthvalue = [];
       for (var i = 0; i < monthvalue7.length; i++) {
         if (i < 4) {
          // console.log(monthvalue7[i].day);
           monthvalue.push(monthvalue7[i].value);
         //  console.log(monthvalue7[i].value);
           monthDate.push(formatTime(monthvalue7[i].day, 'M月'));
         }
       }
    //   console.log(monthDate, monthvalue);
       monthDate.reverse();
       monthvalue.reverse();
      // console.log(monthDate, monthvalue);
       
       //年
       var yearDate = [];
       var yearvalue = [];
       for (var i = 0; i < yearvalue3.length; i++) {
      //   console.log(yearvalue3[i].day);
         yearvalue.push(yearvalue3[i].value);
      //   console.log(yearvalue3[i].value);
         yearDate.push(formatTime(yearvalue3[i].day, 'Y年'));

       }
    //   console.log(yearDate, yearvalue);
       yearDate.sort();
       yearvalue.reverse();
     //  console.log(yearDate, yearvalue);

      that.setData({
        yearvalue: yearvalue,
        yearDate: yearDate,
        dayvalue: dayvalue,
        dayDate: dayDate,
        monthvalue: monthvalue,
        monthDate: monthDate,
        weekvalue: weekvalue,
        weekDate: weekDate3,
        accessday : accessday,
      });

   //   console.log(windowWidth);
      that.areaChart(windowWidth);
     

      },
      fail: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
          title: '全部已加载',
          icon: "fail",
          duration: 1000
        })

      },

    })
  },
  lookAllTap:function(){
    wx.navigateTo({
      url: '../allDeviceData/allDeviceData?deviceId=' + this.data.deviceid + '&currentTime=' +null

    })
  },
  

})
//时间戳转换

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
} 