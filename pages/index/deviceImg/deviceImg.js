// pages/index/deviceImg/deviceImg.js
var width = getApp().globalData.screenWidth-20;
var service_Url = getApp().globalData.service_Url;
var height = width*24 / 26;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataset:null,
    width: width,
    height: height,
    imgurl:null,
    imgArr:[],
    imgIndex:null,
    lastX: 0,
    lastY: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.dataset,options.imgIndex)
    var data = JSON.parse(options.dataset)
    var imgArr = JSON.parse(options.imgArr)
    console.log(imgArr)
    var imgIndex = options.imgIndex
    var imgurl = service_Url + 'nbiot/' + data.access_new_url
    console.log(imgurl)
    this.setData({
      dataset:data,
      imgurl: imgurl,
      imgArr: imgArr,
      imgIndex: imgIndex
    })
    console.log(height)
    wx.setNavigationBarTitle({
      
      title: data.timesto })
  },

  handletouchend: function (event) {
    console.log(event)
    let currentX = event.changedTouches[0].pageX
    let currentY = event.changedTouches[0].pageY

    console.log(currentX)
    console.log(this.data.lastX)
    
    if ((currentX - this.data.lastX) < 0){
      console.log("zuo")
      if (this.data.imgArr.length-2 < this.data.imgIndex) {
        console.log(this.data.imgIndex)
      }else{

      
      this.data.imgIndex++
      console.log(this.data.imgIndex)
      var model = this.data.imgArr[this.data.imgIndex]
      var imgurl = service_Url + 'nbiot/' + model.access_new_url
      this.setData({
        dataset: model,
        imgurl: imgurl,

      })
      wx.setNavigationBarTitle({

        title: model.timesto
      })

      }
    }
    

    else if (((currentX - this.data.lastX) > 0)){
      console.log("向右滑动")
      if (this.data.imgIndex == 0) {
        console.log('已经是第一个了')
        console.log(this.data.imgIndex)
        wx.showToast({
          title: '已经是第一个了',
          image: "../../../images/home_icon_orange@3x.png",
          duration: 2000
        });


      } else {
        this.data.imgIndex--
        var model = this.data.imgArr[this.data.imgIndex]
        var imgurl = service_Url + 'nbiot/' + model.access_new_url
        this.setData({
          dataset: model,
          imgurl: imgurl,
         
        })
        wx.setNavigationBarTitle({

          title: model.timesto
        })
        console.log(this.data.imgIndex, model)
      }
    }
  

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX
    this.data.lastY = currentY
    
  },

  handletouchtart: function (event) {
    
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  handletap: function (event) {

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