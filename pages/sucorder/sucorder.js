// pages/sucorder/sucorder.js
var apimg = getApp().globalData.apimg;
const request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Goods:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that=this;
   that.goodList()
  },

  /**
   * 请求商品数据
  */
  goodList:  function(){
    let that=this;
    var parms = {}
    var goods = {}
    goods.brandId = 32
    // goods.catId = option.catId
    parms.goods = goods
    request.moregets('/api/Goods/getGoodsAll',{parms: parms}).then(function(res){
      console.log("查看数据", res)
      that.setData({
        Goods: res.Goods
      })
    })
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    return {
      title: '微鑫云臻',
      desc: '微鑫云臻',
      path: 'pages/index/index'
    }
  }
})