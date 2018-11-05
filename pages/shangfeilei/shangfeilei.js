var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
const request = require('../../utils/request.js')
Page({
  data: {
    jiahao:apimg+"/images/phonefenlei/jia.png",
    ind: 0,
  },
  // 刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500) 
  },
  onShareAppMessage: function () {
    withShareTicket: true
  },
  onLoad: function (options) {
    var that = this
    try {
      var indexdata = wx.getStorageSync('indexdata')
      if (indexdata) {
        indexdata: indexdata
      }
    } catch (e) {

    }
    request.moregets('/api/Goods/GoodCatAll').then(function (res) {
      that.setData({
        currentType: res.GoodCatAll[0].catId,
        GoodCatAll: res.GoodCatAll,
        Goods: res.Goods,
        message: indexdata,
        indexNotice: res.indexNotice
        //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
      })
    })
  },
  currentType: function (e) {
    let catId = e.target.id;
    let foodType = e.target.dataset.index;
    var that = this
    let parms = {}
    let goods = {}
    goods.catId = catId
    parms.goods = goods
    request.moregets('/api/Goods/getGoodsAll', parms).then(function (res) {
      that.setData({
        currentType: res.GoodCatAll[0].catId,
        GoodCatAll: res.GoodCatAll,
        Goods: res.Goods,
        message: indexdata,
        indexNotice: res.indexNotice
        //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
      })
    })
  },
swiperbind: function (e) {
    wx.navigateTo({
      url: '../group/group',
    })
  },
})