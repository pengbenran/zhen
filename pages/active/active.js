// pages/active/active.js
var util = require('../../utils/util.js');
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
// var apis = getApp().globalData.apis;
//获取应用实例
var app = getApp()
Page({
  //页面的初始化数据
  data: {
    trues: true,
    apiLimit:[],
    pingtuanList:[],
    currentTab: 0,
    disimg: apimg + "/image/treeyiqi/banner.png",
    marimg: apimg + "/image/treeyiqi/yuan2.png",
    btnimg: apimg + "/image/treeyiqi/kan.png",
    speimg: apimg + "/image/treeyiqi/banner.png",
    "pingimg": apimg + "/image/treeyiqi/tu1.png",
    tuanimg: apimg + "/image/treeyiqi/tuan.png",
    joinimg: apimg + "/image/treeyiqi/tu2.png",
    headimg: apimg + "/image/wode/zu18.png",
    headimgtwo: apimg + "/images/quanbufeilei/zu31.png",
    footerimg: apimg + "/image/treeyiqi/jia.png",
  },
  onShareAppMessage: function () {
    return {
      title: '微鑫云小程序',
      desc: '最具吸引力的人气小程序',
      path: '/page/user?id=123'
  }
  },
  //下拉刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    this.onShow();
  },
  dist: function () {
    wx.navigateTo({
      url: '../dist/dist',
    })
  },
  onShow:function(){
    if (wx.getStorageSync('memberId') == "00") {
      wx.showModal({
        title: '提示',
        content: '你还未登录，是否登录',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    }
  },
  onLoad: function () {
    var that = this
    that.setData({
      memberId: wx.getStorageSync('memberId'),
      memberIdlvId:wx.getStorageSync('memberIdlvId')
    })
    if (wx.getStorageSync('memberId') != "00") {
      // 说明已经是会员了，可以看到活动
      wx.request({
        url: api + '/api/activity/limit',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          // 拼团活动没有添加商品 
          var limitActive=[];
          for(var i=0;i<res.data.apiLimit.length;i++){
            limitActive=limitActive.concat(res.data.apiLimit[i].apilimitGoods)
          }
          that.setData({
            apiLimit: limitActive,
            limitActive:res.data.apiLimit
          })
        }
      });
    }
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  // 滑动切换
  changes: function (e) {
  
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    var memberId = wx.getStorageSync('memberId')
    if (e.detail.current == 0) {
      wx.request({
        url: api + '/api/activity/limit',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          var limitActive = [];
          for (var i = 0; i < res.data.apiLimit.length; i++) {
            limitActive = limitActive.concat(res.data.apiLimit[i].apilimitGoods)
          }
          that.setData({
            apiLimit: limitActive
          })
        }  
      });
    }
    else if(e.detail.current == 1) {
      wx.request({
        url: api + '/api/collage/collageGoodsList',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          that.setData({
            pingtuanList: res.data
          })
        }
      });
    }
    else if (e.detail.current == 2){
      wx.request({
        url: api + '/api/cut/cutList',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
            that.setData({
              data: res.data.data
            })
        },
      });
    }
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
    if (e.target.dataset.current == 0) {
      wx.request({
        url: api + '/api/activity/limit',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          var limitActive = [];
          for (var i = 0; i < res.data.apiLimit.length; i++) {
            limitActive = limitActive.concat(res.data.apiLimit[i].apilimitGoods)
          }
          that.setData({
            apiLimit: limitActive
          })
        }
      });
    }
    else if (e.target.dataset.current == 1) {
      wx.request({
        url: api + '/api/collage/collageGoodsList',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          that.setData({
            pingtuanList: res.data
          })
        }
      });
    }
    else if (e.target.dataset.current == 2) {
      wx.request({
        url: api + '/api/cut/cutList',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          that.setData({
            data: res.data.data
          })
        },
      });
    }

  },
  //商城 定制 资讯 tab 切换事件
  OnTabChangeEvent(event) {
    var current = event.detail.current;
    this.setData({
      currentTab: current
    });
  },
  // 编辑跳转js
  xianshi: function (e) {
    var that=this;
    var indx=e.currentTarget.id
    let xianshi = that.data.apiLimit[indx]
    var xianshidetail = {}
    for(var i=0;i<that.data.limitActive.length;i++){
      if (that.data.limitActive[i].limitId == xianshi.limitId){
        xianshidetail.endtime = that.data.limitActive[i].endtime
        xianshidetail.perTotal = that.data.limitActive[i].perTotal
        var fitMemberType = that.data.limitActive[i].fitMemberType
      }
    }
    xianshidetail.finalAmount = xianshi.finalAmount
    xianshidetail.goodsPrice = xianshi.goodsPrice
    xianshidetail.goodsId = xianshi.goodsId
    xianshidetail.limitId = xianshi.limitId
    var lvidarr = fitMemberType.split(",")
    for(var i=0;i<lvidarr.length;i++){
      lvidarr[i]=lvidarr[i]*1
    }
    if (lvidarr.indexOf(that.data.memberIdlvId)<0){
      wx.showModal({
        title: '提示',
        content: '您暂时不能参加该活动！',
        success: function (res) {
          if (res.confirm) {
           
          } else if (res.cancel) {
          
          }
        }
      })
    } else if (xianshidetail.endtime<(new Date()).valueOf()){
      wx.showToast({
        title: '该活动已结束',
      });
    }
    wx.navigateTo({
      url: '../zhekouxiangqing/zhekouxiangqing?xianshidetail=' + JSON.stringify( xianshidetail)
    })
  },
  //拼团 编辑跳转js
  pingtuan: function (e) {
    var goodString = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../pintuanxiangqing/pintuanxiangqing?collageGoodsId=' + goodString.collageGoodsId + '&goodsId=' + goodString.goodsId,
    })
  },
  // 砍价 编辑跳转js
  kanjia: function (e) {
    var good = {}
    good.goodsId = e.currentTarget.id
    // good.goodsId = 199745
    good.cutId = e.currentTarget.dataset.cutid
    good = JSON.stringify(good)
    wx.navigateTo({
      url: '../kanjiaxiangqing/kanjiaxiangqing?good=' + good,
    })
  },
})
