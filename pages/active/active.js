// pages/active/active.js
var util = require('../../utils/util.js');
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
const request = require('../../utils/request.js')
// var apis = getApp().globalData.apis;
//获取应用实例
var app = getApp()
Page({
  //页面的初始化数据
  data: {
    apiLimit:[],
    pingtuanList:[],
    currentTab: 0,
    marimg: apimg + "/image/treeyiqi/yuan2.png",
    footerimg: apimg + "/image/treeyiqi/jia.png",
  },
  onLoad: function () {
    var that = this
    that.setData({
      memberId: wx.getStorageSync('memberId'),
      memberIdlvId:wx.getStorageSync('memberIdlvId')
    })
    that.getLimit()
  },
// 封装获取限时折扣方法
  getLimit:function(){
    //  请求限时折扣的列表
    let that=this
    request.moregets('/api/activity/limit').then(function (res) {
      let limitActive = [];
      for (var i = 0; i < res.apiLimit.length; i++) {
        limitActive = limitActive.concat(res.apiLimit[i].apilimitGoods)
      }
      that.setData({
        apiLimit: limitActive,
        limitActive: res.apiLimit
      })
    })
  },
  getColloageList:function(){
    let that = this
    request.moregets('/api/collage/collageGoodsList').then(function (res) {
      that.setData({
        pingtuanList: res
      })
    })
  },
  getCutList:function(){
    let that = this
    request.moregets('/api/cut/cutList').then(function (res) {
      that.setData({
        data: res.data
      })
    })
  },
  // 滑动切换
  changes: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    var memberId = wx.getStorageSync('memberId')
    if (e.detail.current == 0) {
      that.getLimit();
    }
    else if(e.detail.current == 1) {
      that.getColloageList();
    }
    else if (e.detail.current == 2){
     that.getCutList();
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
      that.getLimit();
    }
    else if (e.target.dataset.current == 1) {
      that.getColloageList();
    }
    else if (e.target.dataset.current == 2) {
      that.getCutList();
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
    }else{
      wx.navigateTo({
        url: '../zhekouxiangqing/zhekouxiangqing?xianshidetail=' + JSON.stringify(xianshidetail)
      })
    }
   
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
