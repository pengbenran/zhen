var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    boder:apimg+"/images/phonefenlei/jia.png",
    addto:apimg+"/images/phonefenlei/jia.png",
    jiaboderimg:apimg+"/images/phonefenlei/jia.png",
    jinimg:"../images/phonefenlei/jia.png",
    Goods:[],
  },
  onShareAppMessage: function () {
    withShareTicket: true
  },
  onLoad:function(option){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var parms = {}
    var goods = {}
    goods.brandId = option.brandId
    goods.catId=option.catId  
    parms.goods = goods
    wx.request({
      url: api+'/api/Goods/getGoodsAll',
      data:{
        parms:parms
      },
      header: {
        'Content-Type': 'json'
      },
      success:function(res){
        wx.hideLoading()
        that.setData({
          Goods: res.data.Goods
        })
        wx.setNavigationBarTitle({
          title: option.titlebar//页面标题为路由参数
        })
      }
    })
  },
// 商品详情跳转
  swiperbind: function (e) {
    wx.navigateTo({
      url: '../group/group',
    })
  }
})