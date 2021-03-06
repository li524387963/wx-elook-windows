var checkdev_URL = getApp().globalData.checkdev_URL;
var scrollHeight = getApp()
.globalData.screenHeight-114;
var devtime_Select_Url = getApp().globalData.devtime_Select;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:'',
    startDate:'',
    endDate:'',
    infoone:[],
    page:1,
    pagenum:0,
    hide:true,
    scrollHeight: scrollHeight,
    minDate:'',
    maxDate:'',
    select:false,
    info:[],
    imgArr: [],
    currentTime:null

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceId: options.deviceId,
      currentTime: options.currentTime
    });
    console.log(checkdev_URL)

    console.log(options.currentTime)
    

    if (options.currentTime=="null"){
      wx.setNavigationBarTitle({

        title:"全部列表"
      })
      var data = { deviceid: this.data.deviceId, aip: "ios", page: '1' }
      
      this.request(checkdev_URL, data)
    }else{
      wx.setNavigationBarTitle({
        title: "本日列表"
      })

      var start = formatTime(options.currentTime, 'Y-M-D')

      var tomorrow_timetamp = parseInt(options.currentTime) + 24 * 60 * 60;

      var end = formatTime(tomorrow_timetamp, 'Y-M-D')        
      var data = { deviceid: this.data.deviceId, aip: "ios", page: '1', start: start, end: end }
      console.log(data)
      
      this.requestSelect(devtime_Select_Url, data)
    }
    
    
  },
  request:function(url,data){
    var that = this
    console.log(data)
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
      data:data,
      success: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        console.log(res.data)
        
        if (res.data.UserInfo.ret.status_code == 10000909){
          wx.showToast({
            title: '暂无数据',
            icon: "success",
            duration: 2000
          })
        }else{
        that.setData({
          infoone: res.data.UserInfo.ret.infoone,
          pagenum: res.data.UserInfo.ret.pagenum ,
        });

        if (res.data.UserInfo.ret.infoone.length == 0){
          wx.showToast({
            title: '暂无数据',
            icon: "success",
            duration: 2000
          })
        }else{
          console.log(that.data.pagenum)
          for (var i = 0; i < res.data.UserInfo.ret.infoone.length; i++) {
            that.data.infoone[i].timesto = formatTime(res.data.UserInfo.ret.infoone[i].access_time, 'Y-M-D h:m:s')
            that.data.infoone[i].dateto = formatTime(res.data.UserInfo.ret.infoone[i].access_time, 'Y-M-D')
            
           if (that.data.infoone[i].access_new_url!=null){
           
            that.data.imgArr.push(that.data.infoone[i])
          }
         
          };
        
        
          var tomorrow_timetamp = parseInt (res.data.UserInfo.ret.infoone[0].access_time) + 24 * 60 * 60;
        
          var endDate = formatTime(tomorrow_timetamp, 'Y-M-D')
          console.log(endDate)

          that.setData({
            infoone: that.data.infoone,
            endDate: endDate,
            startDate: that.data.infoone[that.data.infoone.length - 1].dateto,

          });
         
          console.log(that.data.infoone, that.data.imgArr)
        }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  bindDateChange:function(e){
    console.log(e)
    this.setData({
      startDate: e.detail.value
    })
    
  },
  endDateChange:function(e){
    this.setData({
      endDate: e.detail.value
    })
  },
  //查询
  bindtap:function(e){
   
    var start = null;
    var end = null;
    if (this.data.startDate >= this.data.endDate){
        console.log(22222)
        start = this.data.endDate
        end = this.data.startDate
    }else{
      start = this.data.startDate
      end = this.data.endDate
    }
    var data = { deviceid: this.data.deviceId, aip: "ios", page: '1', start: start, end: end }
    console.log(data)
    this.requestSelect(devtime_Select_Url, data)

  },
  tap:function(e){
    console.log(e)
    
    var newUrl = e.currentTarget.dataset.access_new_url
    // var datae :{
    //    newUrl: newUrl,
    //    eid:e.currentTarget.dataset.eid
    // };
    var imgIndex ;
   this.data.imgArr.forEach(function (value,index){
      
     if (value.access_new_url ==newUrl){
        
          imgIndex = index
        }
   });

   console.log(imgIndex)

    if (newUrl!=null){
      wx.navigateTo({
       // url: '../deviceImg/deviceImg?newUrl=' + newUrl,
        url: '../deviceImg/deviceImg?dataset=' + JSON.stringify(e.currentTarget.dataset) + '&imgArr=' + JSON.stringify(this.data.imgArr) + '&imgIndex=' + imgIndex,
        succes:function(e){
          console.log(e)
        },
        fail:function(e){
          console.log(e)
        }
      })
    }
   
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
    this.data.select = false;
    // this.setData({
    //   select: false
    // })
    this.data.page = 1;
    this.setData({
      imgArr: []
    });
   
    wx.showNavigationBarLoading();
    // var data = { deviceid: this.data.deviceId, aip: "ios", page: '1' }
    // this.request(checkdev_URL, data)

    if (this.data.currentTime == "null") {
      
      var data = { deviceid: this.data.deviceId, aip: "ios", page: '1' }

      this.request(checkdev_URL, data)
    } else {
    
      var start = formatTime(this.data.currentTime, 'Y-M-D')

      var tomorrow_timetamp = parseInt(this.data.currentTime) + 24 * 60 * 60;

      var end = formatTime(tomorrow_timetamp, 'Y-M-D')
      var data = { deviceid: this.data.deviceId, aip: "ios", page: '1', start: start, end: end }
      console.log(data)

      this.requestSelect(devtime_Select_Url, data)
    }
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    
   
    
  },
  //加载更多
  //
  bindscrolltolower:function(res){
   console.log(res);
   

   var that = this
   if (that.data.page < that.data.pagenum) {
     that.data.page++;
     console.log(that.data.page)

    if(that.data.select == false){
      var data = { deviceid: this.data.deviceId, aip: "ios", page: that.data.page }
      var URL = checkdev_URL
    }else{
      var data = { deviceid: this.data.deviceId, aip: "ios", page: that.data.page, start: this.data.startDate, end: this.data.endDate }
      var URL = devtime_Select_Url
    }
     

     console.log(data)


     wx.showLoading({
       title: '加载中...',
       icon: "loading",
       duration: 10000
     })
     wx.request({
       url: URL,
       header: {
         'content-type': "application/x-www-form-urlencoded"

       },
       method: "POST",
       data: data,
       success: function (res) {
         wx.hideLoading();
         wx.hideNavigationBarLoading() //完成停止加载
         wx.stopPullDownRefresh() //停止下拉刷新
         console.log(res.data)
         var contentList = [];
         if (that.data.select == false) {
           contentList = that.data.infoone.concat(res.data.UserInfo.ret.infoone)
           that.setData({
             infoone: contentList
           });
           console.log(contentList)
           that.setData({
             imgArr: []
           });
           for (var i = 0; i < contentList.length; i++) {
             that.data.infoone[i].timesto = formatTime(contentList[i].access_time, 'Y-M-D h:m:s')
             that.data.infoone[i].dateto = formatTime(contentList[i].access_time, 'Y-M-D')
             if (that.data.infoone[i].access_new_url != null) {
               
               that.data.imgArr.push(that.data.infoone[i])
             }
           };
           that.setData({
             infoone: that.data.infoone,
             endDate: that.data.infoone[0].dateto,
             startDate: that.data.infoone[that.data.infoone.length - 1].dateto,
           });
           console.log(that.data.infoone.length, that.data.imgArr.length)
         }else{
           contentList = that.data.infoone.concat(res.data.UserInfo.ret.info)
           that.setData({
             infoone: contentList,
             endDate: res.data.UserInfo.ret.end,
             startDate: res.data.UserInfo.ret.start,
           });
           console.log(contentList)

           for (var i = 0; i < contentList.length; i++) {
             that.data.infoone[i].timesto = formatTime(contentList[i].access_time, 'Y-M-D h:m:s')
             if (that.data.infoone[i].access_new_url != null) {

               that.data.imgArr.push(that.data.infoone[i])
             }
            
           };
           that.setData({
             infoone: that.data.infoone,
            
           });
           console.log(that.data.infoone)
         }

        

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

  requestSelect:function(url,data){
    this.data.select = true;
    this.data.page = 1;
    var that = this
    console.log(data)
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
        console.log(res.data)
        that.setData({
          infoone: res.data.UserInfo.ret.info,
          pagenum: res.data.UserInfo.ret.pagenum,
          endDate: res.data.UserInfo.ret.end,
          startDate: res.data.UserInfo.ret.start,
        });
        if (res.data.UserInfo.ret.info.length == 0) {
          wx.showToast({
            title: '暂无数据',
            icon: "success",
            duration: 2000
          })
        } else {
          for (var i = 0; i < res.data.UserInfo.ret.info.length; i++) {
            that.data.infoone[i].timesto = formatTime(res.data.UserInfo.ret.info[i].access_time, 'Y-M-D h:m:s')
            if (that.data.infoone[i].access_new_url != null) {

              that.data.imgArr.push(that.data.infoone[i])
            }

          };
          that.setData({
            infoone: that.data.infoone,


          });
          console.log(that.data.infoone)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
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


