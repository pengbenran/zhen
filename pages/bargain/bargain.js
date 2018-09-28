var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    head: apimg + "/image/wode/zu17.png",
    address:"请选择地址",
    mobile:"绑定手机号码",
    disabled:false,
    memberLvList:[], 
    isSubmit:true,
    isPass:true,
    tip:''
  },
  onLoad: function (options) {
    var that=this;
    var memberId = wx.getStorageSync('memberId')
    that.setData({
      memberId: memberId,
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ImageWidth: res.screenWidth+'px',
          ImageHeight:res.screenWidth/2.757+'px',
          introImageHeight: res.screenWidth / 4.167 + 'px',
          introHeight: res.screenHeight - res.screenWidth / 2.757 - res.screenWidth / 4.167+'px'
        })
      }
    })
    wx.request({
      url: api + '/api/distribe/whetherSubmit',
      headers: {
        'Content-Type': 'application/json'
      },
      data:{
        memberId: that.data.memberId
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            isSubmit:false,
          })
          wx.request({
            url: api + '/api/distribe/memberLvList',
            headers: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              if(res.data.code==0){
                that.setData({
                  memberLvList: res.data.memberLvList
                })
              }
            }
          })
        }
        else{
          that.setData({
            isSubmit: true,
          })
          wx.request({
            url: api + '/api/distribe/whetherPass',
            headers: {
              'Content-Type': 'application/json'
            },
            data:{
              memberId: that.data.memberId
            },
            success: function (res) {
              if(res.data.msg=="未审核"){
                that.setData({
                  isPass:false,
                  tip:' 微分销会员申请已经提交，请等待审核结果'
                })
              }
              else if(res.data.msg=="未通过审核"){
                that.setData({
                  isPass: false,
                  tip: '微分销会员申请未通过，请联系管理员'
                })
              }
              else{
                that.setData({
                  isPass:true,
                  money:res.data.money
                })
              }
            }
          })
        }
      }
    })
    
  },
  jump:function(e){
    wx.navigateTo({
      url: '../membership/membership?lvId='+e.currentTarget.dataset.ivid,
    })

  },
  jupminfodetail:function(){
    var that=this;
    wx.navigateTo({
      url: '../membershipdetail/membershipdetail?money=' + that.data.money,
    })
  }
})