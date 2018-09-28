// pages/quan/quan.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pingtuandetail:{},
    "paly": [apimg + "/image/gotuan/wen.png"],
  head:[
   {
      img:'/image/15.png'
   },
{
  img: '/image/15.png'
},
{
  img: '/image/15.png'
},
{
  img: '/image/15.png'
},
{
  img: '/image/15.png'
},
  ]



  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var pingtuandetail = JSON.parse(options.shops)
    var params = {}
    params.goodsId = pingtuandetail.goodsId
    params.memberCollageId = pingtuandetail.memberCollageId
    wx.request({
      url: api + '/api/collage/collageSucceed',
      data: {
        "params": params
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          windowHeight: wx.getStorageSync('windowHeight'),
          collageSucceed: res.data.collageSucceed,
          pingtuandetail: pingtuandetail,
          memberId: wx.getStorageSync('memberId')
        });

      },
      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
    });
  },

  //拼团跳转  
  gotuan: function () {
    wx.switchTab({
      url: '../active/active',
    })
  },
  onShareAppMessage: function () {
    var that = this
    var fenxiangpingtuan={}
    fenxiangpingtuan = that.data.pingtuandetail
    fenxiangpingtuan.memberId = that.data.memberId
    fenxiangpingtuan=JSON.stringify(fenxiangpingtuan)
    return {
      path: '/pages/join/join?fenxiangpingtuan=' + fenxiangpingtuan,
    }
  },  
})