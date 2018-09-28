var apimg = getApp().globalData.apimg;
// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productData: [],
    hotKeyList:[
      {
      "keyword": ["vivo X20"]
      },
      {
        "keyword": ["vivo X20"]
      },
      {
        "keyword": ["vivo X20"]
      },
      {
        "keyword": ["vivo X20"]
      },
      {
        "keyword": ["vivo X20"]
      },
      {
        "keyword": ["vivo X20"]
      },
      {
        "keyword": ["vivo X20"]
      },
    ]

  },
  onShareAppMessage: function () {


    withShareTicket: true

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

doKeySearch:function(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({
      searchValue: key,
    });
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