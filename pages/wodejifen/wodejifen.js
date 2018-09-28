var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
const util = require('../../utils/util.js')
//获取应用实例
let app = getApp()
Page({
  data: {
    tabPageHeight:350,
    currentTab: 0,
    "headimg": [apimg+"/images/jifen/bgtu.png"],
    "qianimg": [apimg+"/images/jifen/qiandao.png"],
    // "signtext":"未签到",

    total:[
      {
       "song": "签到送积分",
       "addone": "+2.00",
       "time": "2018-07-05"
      },
      {
      
      },
      {}
    ]


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

  // 仅执行一次，可用于获取、设置数据
  onLoad(options) {
    new app.WeToast()
    var that = this
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
  var  memberId = memberId
    wx.request({
      //url: api + '/api/member/point',
      url:api+'/api/member/point',
      data: {
        "memberId": memberId
      },
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        var point = res.data.mp
        var signStatus = res.data.signStatus
        var pointSign = res.data.pointSign
        for (var i = 0; i < pointSign.length; i++) {
          pointSign[i]["signTime"] = util.formatTime(new Date(pointSign[i]["signTime"]))
        }
        that.setData({
          mp: point,
          signStatus: signStatus,
          pointSign: pointSign
        })
      }
    })
  },
  onTimeToast() {
    var aa ='+'+2;
    var that = this
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    var parms = {}
    parms.memberId = memberId  
    parms.cutpoint = 2  //积分签到获取
    var parms = JSON.stringify(parms)
    if (that.data.signStatus == 1){

      wx.request({
        url: api+'/api/member/upMemberLv',
        method: 'POST',
        data: {
          parms: parms
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({
          
          })
          that.onLoad()
        }
      })
      that.wetoast.toast({
        title: aa,
        duration: 200
      })
    }
    if (this.data.signStatus == 2){
      wx.showModal({
        title: '提示',
        content: '你已经签到过了哦！',
      })
      that.setData({

      })
      return;
    }
  },
})