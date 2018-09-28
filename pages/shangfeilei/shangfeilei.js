var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    "port": [apimg+"/images/quanbufeilei/zu31.png"],
    "rait": [apimg+"/images/quanbufeilei/8.png"],
    "jia": [apimg+"/images/phonefenlei/jia.png"],
    "borderimg": [apimg+"/images/phonefenlei/jia.png"],
    choimage:apimg+"/images/shoucan/zu31.png",
    jiahao:apimg+"/images/phonefenlei/jia.png",
    ind: 0,

  left: [
    {
      index:"0",
      id:"1"
  },
  {
    index: "1",
    id:"2"
  },
  {
    index: "2",
    id:"3"
   
  },
  {
    index: "3",
    id:"4"
  },
  ],

  commo: [
    {
      codImgs: apimg+"/images/shoucan/zu31.png",
      copy: "关注微信公众号DGTFG54454领取优惠",
      money: "￥998.00"
    },
    {
      codImgs: apimg+"/images/shoucan/zu32.png",
      copy: "这是文案文案文这是文案文案文这是文案文案文",
      money: "￥998.00"
    }
  ],


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
    this.onLoad();
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
    wx.request({
      url: api + '/api/Goods/GoodCatAll',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫zhihu的这个数组中
        console.log(res.data)
        that.setData({
          currentType: res.data.GoodCatAll[0].catId,
          GoodCatAll: res.data.GoodCatAll,
          Goods:res.data.Goods,
          message: indexdata,
          indexNotice: res.data.indexNotice
          //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
        })
      }
    })
  },
  currentType: function (e) {
    let catId = e.target.id;
    let foodType = e.target.dataset.index;
    var that = this
    var parms = {}
    var goods = {}
    goods.catId = catId
    parms.goods = goods

    wx.request({
      url: api + '/api/Goods/getGoodsAll',
      data: {
        parms: parms
      },
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        that.setData({
          currentType: catId,
          Goods: res.data.Goods
        })
      }
    })
  },

swiperbind: function (e) {
    wx.navigateTo({
      url: '../group/group',
    })
  },


})