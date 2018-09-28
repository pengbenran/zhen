 var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    redPacket:'',
    tabPageHeight: 600,
    currentTab: 0,
    "Receive": ["未领取"],
    "use": ["已使用"],
    "notuse": ["未使用"],
    "overdue": ["已过期"],
    "members": [apimg + "/images/youhuijuan/zu26.png"],
    "moneyleft": 50,
    "youhui": ["优惠券说明"],
    "pretext": ["满680元可用"],
    "data": ["有效期： 2018-03-01至2018-04-01"],
    "t1": ["立"],
    "t2": ["即"],
    "t3": ["领"],
    "t4": ["取"],
    "premoney": ["20"],
    "yuan": ["元"],
    "pretext2": ["满680元可用"],
    "member3": [apimg + "/images/youhuijuan/zu25.png"],
  },

  onLoad: function (option) {
    var that=this
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    if(option.type==1){
      wx.request({
        url: api + '/api/redPacket/selectMermberRed',
        data: {
          memberId: memberId
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 0 && res.data.redPacket.state==1){
            that.setData({
              redPacket: res.data.redPacket
            })
          }     
        }
      })
    }else{
      var parms = {}
      var parmss = JSON.parse(option.parms)
      var orderAmount = parmss.orderAmount
      parms.goodsIds = parmss.goodsIds
      parms.memberId = memberId
      parms = JSON.stringify(parms)
      var that = this
      // wx.showLoading({
      //   title: '加载中',
      // })
      // setTimeout(function () {
      //   wx.hideLoading()
      // }, 500)
      wx.request({
        url: api + '/api/vocher/voucherUsed',
        data: {
          params: parms
        },
        header: {
          'Content-Type': 'json'
        },
        success: function (res) {
          that.setData({
            voucherUsed: res.data.voucherUsed,
            orderAmount: orderAmount
          })
        }
      })
    }  
  },
  useRedbao:function(e){
    var memberredpacketid = e.currentTarget.dataset.memberredpacketid
    var amount = e.currentTarget.dataset.conditionamount
    wx.navigateTo({
      url: '../dingdan/dingdan?&pars=2' + "&memberredpacketid=" + memberredpacketid + "&redamount=" + amount,
    })  
  },
  shiyong:function(e){
    var orderAmount = this.data.orderAmount
    var facevalue = e.currentTarget.dataset.facevalue
    var parms = {}
    try {
      var conditionAmount = e.currentTarget.dataset.conditionamount

    } catch (e) {
    }
    if (conditionAmount != undefined){
      if (orderAmount >= conditionAmount){
        var order = orderAmount - facevalue
         var pars = 1
         var memberVoucherId = e.currentTarget.dataset.membervoucherid
         wx.navigateTo({
           url: '../dingdan/dingdan?pars=' + pars + "&memberVoucherId=" + memberVoucherId + "&facevalue=" + facevalue ,
         })
      }   
     else{
      wx.showModal({
        title: '提示',
        content: '你没达到该优惠券的满减金额！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    }else{
     var order = orderAmount - facevalue
     var pars = 1
     var memberVoucherId = e.currentTarget.dataset.membervoucherid
     wx.navigateTo({
       url: '../dingdan/dingdan?&pars='+ pars + "&memberVoucherId=" + memberVoucherId + "&facevalue=" + facevalue,
     })  
  }
  }

})