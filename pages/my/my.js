var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
var apis = getApp().globalData.apis;
// pages/my/my.js
var util = require('../../utils/util.js');
var app = getApp()
var Info = {}
Page({
  data: {
    hasmemberId: false,
    isUse: true,
    head: apimg + "/image/wode/zu17.png",
    // right: apimg + "/image/wode/kao7.png",
    indent: apimg + "/image/wode/kao6.png",
    df: apimg + "/image/wode/qianbao.png",
    dfh: apimg + "/image/wode/shouhuo.png",
    ds: apimg + "/image/wode/pingjia.png",
    ywc: apimg + "/image/wode/tuihuo.png",
    int: apimg + "/image/wode/jifen.png",
    clor: apimg + "/image/wode/kao6.png",
    inter: apimg + "/image/wode/dizhi.png",
    inte: apimg + "/image/wode/kao6.png",
    integra: apimg + "/image/wode/huiyuan.png",
    core: apimg + "/image/wode/kao6.png",
    youhui: apimg + "/image/wode/youhuiquan.png",
    three: apimg + "/image/wode/kao6.png",
    myping: apimg + "/image/wode/pingtuan.png",
    inteping: apimg + "/image/wode/kao6.png",
    kanjia: apimg + "/image/wode/kanjia.png",
    rightimg: apimg + "/image/wode/kao6.png",
    left: apimg + "/image/wode/shoucang.png",
    shoucan: apimg + "/image/wode/kao6.png",
    shouhou: apimg +"/image/wode/shouhou.png",
    motto: 'Hello World',
    userInfo: {},
    isMember:true
  },
  onShareAppMessage: function () {
    withShareTicket: true
  },
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

  onShow:function(){
    var that = this;
    var memberId = wx.getStorageSync('memberId')
    that.setData({
      memberId: memberId,
    })
    that.getMemberInfo(memberId)
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                userInfo: res.userInfo,
                isUse: true
              })
            }
          })
        }
        else {
          that.setData({
            isUse: false
          })
        }
      }
    })
  },
  onLoad: function () {

  },
  jumpdynamic:function(){
    var that = this
    that.jump('../dynamic/dynamic')
  },
  jumprechge:function(){
    var  that=this
    that.jump('../morepoint/morepoint')
  },
  jumpcomment:function(){
    var that=this;
    that.jump('../comment/comment')
    
  },
  // 获取会员信息
  getMemberInfo: function (memberId) {
    var that = this
    if (memberId == "00") {
      that.setData({
        hasmemberId: false,
      })
    } else {
      that.setData({
        hasmemberId: true,
      })
      var parms = {}
      parms.memberId = memberId
      wx.request({
        url: api + '/api/member/memberIndex',
        data: {
          parms: parms
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 0) {
            if (res.data.memberDO.mp == null) {
              //var point = res.data.memberDO.point
              // res.data.memberDO.point = 0
              var mp = 0;
            } else {
              var mp = res.data.memberDO.mp
            }
            that.setData({
              statuscount: res.data.statuscount,//未付款
              freightstatuscount: res.data.freightstatuscount,//待收货
              finishstatuscount: res.data.finishstatuscount,//已完成
              shippedstatuscount: res.data.shippedstatuscount,//已发货
              lvidname: res.data.memberDO.lvidname,//会员
              mp: mp,
              vouchercount: res.data.vouchercount
              //res代表success函数的事件对，data是固定的
            })
            wx.setStorageSync("point", mp)
          }
        }
      })
    }
  },
  getUserInfo: function (e) {
    var that = this
    that.setData({
      userInfo: e.detail.userInfo,
    })
    that.onShow();
    if (that.data.memberId == "00") {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.getUserInfo({
              success: function (res_user) {
                wx.setStorageSync('name', res_user.userInfo.nickName)
                wx.setStorageSync('face', res_user.userInfo.avatarUrl)
                wx.request({
                  url: api + '/api/weCatLogin',
                  data: {
                    code: res.code,//获取openid的话 需要向后台传递code,利用code请求api获取openid
                    headurl: res_user.userInfo.avatarUrl,//这些是用户的图片信息
                    nickname: res_user.userInfo.nickName,//获取昵称
                    sex: res_user.userInfo.gender,//获取性别
                    country: res_user.userInfo.country,//获取国家
                    province: res_user.userInfo.province,//获取省份
                    city: res_user.userInfo.city//获取城市
                  },
                  success: function (res) {
                    console.log(res.data)
                    that.setData({
                      hasmemberId: true
                    })
                    wx.setStorageSync("openId", res.data.openid)//可以把openid保存起来,以便后期需求的使用
                    wx.setStorageSync("memberId", res.data.memberId)
                    wx.setStorageSync("memberIdlvId", res.data.memberIdlvId)
                    if (wx.getStorageSync('distribeId')==null){
                      that.onShow();
                    }
                    else{
                      wx.request({
                        url: api + '/api/distribe/promotion',
                        data: {
                          distribeId: wx.getStorageSync('distribeId'),
                          memberId: res.data.memberId
                        },
                        method: "POST",
                        header: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                          that.onShow();
                          console.log(res)
                        }
                      })
                    }
                  }

                })

              }

            })

          }
        }
      });
    }
  },
  openMember:function(){
    var that=this;
    if (that.data.hasmemberId && that.data.isUse) {
      wx.request({
        url: api + '/api/distribe/whetherDistribe',
        data: {
          memberId: that.data.memberId
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 0) {
            // wx.navigateTo({
            //   url: '../membershipdetail/membershipdetail?money=' + res.data.money,
            // })
            wx.navigateTo({
              url: '../bargain/bargain',
            })
          }
          else {
            wx.navigateTo({
              url: '../micromember/micromember',
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        duration: 1000
      })
    }   
  },
  jump:function(url){
    var that = this;
    if (that.data.hasmemberId && that.data.isUse) {
      wx.navigateTo({
        url: url ,
      })
    } else {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        duration: 1000
      })
    }
  },
  openposter:function(){
    var that=this;
    that.jump('../distribeposter/distribeposter?distribeId=' + wx.getStorageSync('distribeId'))
  },
  tui: function () {
    var that = this;
    let url = '../tui/tui'
    that.jump(url)
  },
  // 地址管理跳转
  dizhi: function (e) {
    var that = this;
    let url = '../myaddress/myaddress'
    that.jump(url)
  },
  
  // 查看全部订单页面跳转
  fahuo: function (e) {
    var that = this;
    let url = '../fivefahuo/fivefahuo?currentTarget=' + e.currentTarget.id
    that.jump(url)
  },
  // 积分跳转
  jifen: function () {
    var that = this;
    let url = '../wodejifen/wodejifen'
    that.jump(url)
  },
  // 名片跳转
  mingpan: function () {
    var that = this;
    let url = '../mycard/mycard'
    that.jump(url)
  },
  // 会员卡跳转
  huiyuanka: function () {
    var that = this;
    let url = '../huiyuan/huiyuan'
    that.jump(url)
  },
  

  // 优惠券跳转
  youhuijuan: function () {
    var that = this;
    let url = '../youhuijuan/youhuijuan'
    that.jump(url)
  },
  // 拼团跳转
  pingtuan: function () {
    var that = this;
    let url = '../mypingtuan/mypingtuan'
    that.jump(url)
 
  },
  // 砍价跳转
  kanjia: function () {
    var that = this;
    let url = '../mykanjia/mykanjia'
    that.jump(url)
  },
  // 收藏跳转
  shoucang: function () {
    var that = this;
    let url = '../shoucan/shoucan'
    that.jump(url)
  },
})