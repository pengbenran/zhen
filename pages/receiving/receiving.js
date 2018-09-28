var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
const util = require('../../utils/util.js')
Page({
  data: {
    "canimg": [apimg+"/image/gotuan/tu1.png"],
    "fenxiang": [apimg+"/image/gotuan/fen.png"],
    "gimg": [apimg+"/image/gotuan/6.png"],
    "wacth": [apimg+"/image/gotuan/zhong.png"],
    "headimg": [apimg+"/image/gotuan/tou.png"],
    "more": [apimg+"/image/gotuan/dian.png"],
    "paly": [apimg+"/image/gotuan/wen.png"],
    "gtext":["正品保证"],
    "gtext2": ["全场包邮"],
    "gtext3": ["24h发货"],
    "gtext4": ["返点积分"],
    windowHeight: 654,
    maxtime: "",
    pingData:[],
    isHiddenLoading: true,
    isHiddenToast: true,
    dataList: {},
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0,
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad()
  },
  onLoad: function (options) {
    var that = this 
    var pingData = JSON.parse(options.parms)
    var params = {}
    params.goodsId = pingData.goodsId
    params.memberCollageId =pingData.memberCollageId
    wx.request({
      url: api + '/api/collage/collageSucceed',
      data: {
        "params": params
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var collageSucceed = res.data.collageSucceed
        for (var i = 0; i < collageSucceed.length; i++) {
          collageSucceed[i]["entertime"] = util.formatTime(new Date(collageSucceed[i]["entertime"]))
        }
        that.setData({
          windowHeight: wx.getStorageSync('windowHeight'),
          collageSucceed: collageSucceed,
          pingData: pingData
        });
      },
    });
  },


  onShareAppMessage: function () {
    var that=this;
    return {
      path: '/pages/join/join?data=' + JSON.stringify(that.data.pingData),
    }
},



  //拼团跳转  
  gotuan: function () {
    
    var goodsId = this.data.data.goodsId
    var goodsName = this.data.data.goodsName
    var activityPrice = this.data.data.activityPrice
    var goodsPrice = this.data.data.price
    var collagePersons = this.data.data.collagePersons
    adc.goodsId = goodsId
    adc.goodsName = goodsName
    adc.goodsPrice = goodsPrice
    adc.collagePersons = collagePersons
    adc.activityPrice = activityPrice
    var goodString = JSON.stringify(adc); 
    wx.navigateTo({
      url: '../pintuanxiangqing/pintuanxiangqing?goodString=' + goodString,
    })
  }
})  