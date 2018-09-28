var apimg = getApp().globalData.apimg;
Page({
  data: {
    "headimg": [apimg+"/image/wode/zu18.png"],
    "joinimg": [apimg+"/image/treeyiqi/tu2.png"],
    currentTab: 0,
  },
  onShareAppMessage: function () {


    withShareTicket: true

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
// 商品详情页面跳转
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

})