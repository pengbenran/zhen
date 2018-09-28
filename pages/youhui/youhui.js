var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    boder: apimg + "/images/phonefenlei/jia.png",
    addto: apimg + "/images/phonefenlei/jia.png",
    jiaboderimg: apimg + "/images/phonefenlei/jia.png",
    jinimg: "../images/phonefenlei/jia.png",
    tabPageHeight: 600,
    currentTab: 0,
    commo: [
    ],
    Goods: "",
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
  onLoad: function (option) {
      try {
    var memberId = wx.getStorageSync('memberId')
    if (memberId) {
      memberId: memberId
    }
  } catch (e) {
  } 
  var that = this
      var voucherId = option.voucherid
      var activeType = option.activeType
    wx.request({
      url: api + '/api/vocher/voucherGoods',
      data: {
        voucherId: voucherId,
        activeType: activeType
      },
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        that.setData({
          goods: res.data.goods
        })
      }
    })

  },
  /*页面上拉触底事件的处理函数*/
  onReachBottom: function () {
    var that = this;
    var sendButoomData;
    if (that.data.currentTab == 0) {
      //全部
      sendButoomData = {
        "tokenSession": that.data.tokenSession,
        "lastId": that.data.shopLastId,
        "searchValue": that.data.shopSearchValue
      }

    }
    else if (that.data.currentTab == 1) {
      //待付款
    }
    else if (that.data.currentTab == 2) {
      //待发货
    }
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTba: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    console.log(this.data.goods)
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //商城 定制 资讯 tab 切换事件
  OnTabChangeEvent(event) {
    var current = event.detail.current;
    this.setData({
      currentTab: current
    });
  },
  // 商品详情跳转
  swiperbind: function (e) {
    wx.navigateTo({
      url: '../group/group',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  addToCart: function (e) {


  },
})