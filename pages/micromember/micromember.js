// pages/micromember/micromember.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasmember:false,
    micromemberItem:[
      { itemImg: "https://shop.guqinet.com/html/images/shanquan/icon1.jpg", itemName: '会员升档', itemintro: '升级会员提高分润', url:'../membershioup/membershioup'},
      { itemImg: "https://shop.guqinet.com/html/images/shanquan/icon2.jpg", itemName: '分润商品', itemintro: '分润商品详情', url: '../fengrungood/fengrungood' },
      { itemImg: "https://shop.guqinet.com/html/images/shanquan/icon3.jpg", itemName: '推荐', itemintro: '推荐用户/会员', url: '../memberlist/memberlist'  },
      { itemImg: "https://shop.guqinet.com/html/images/shanquan/icon4.jpg", itemName: '账户管理', itemintro: '会员账户管理', url: '../membermanage/membermanage'  }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that=this;
    var memberId = wx.getStorageSync('memberId')
    that.setData({
      memberId: memberId,
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ImageWidth: res.screenWidth + 'px', 
          ImageHeight: res.screenWidth / 2.02 + 'px',
        })
      }
    })
    wx.request({
      url: api + '/api/distribe/distribe',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        memberId: that.data.memberId
      },
      success: function (res) {
        if (res.data.memberDOList.length==0){
          that.setData({
            hasmember:false
          })
        }
        else{
          that.setData({
            hasmember: true
          })
        }
        that.setData({
          distribeDo: res.data.distribeDo,
          total: res.data.total, //累计到账金额
          totalAssets: res.data.totalAssets,//资产总计
          memberDo: res.data.memberDo, //会员信息
          memberDOList: res.data.memberDOList //下级会员信息
        })
      }
    })

  },
  distribeposter:function(){
    var that=this;
    wx.navigateTo({
      url: '../distribeposter/distribeposter?distribeId=' + that.data.distribeDo.distribeId,
    })
  },
  jumpfenrungood:function(e){
    var that=this;
    if (e.currentTarget.dataset.url =="../membershioup/membershioup"){
      wx.request({
        url: api + '/api/distribe/memberLvList',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 0) {
            var flag=true;
            for (var i = 0; i < res.data.memberLvList.length;i++){
              if (res.data.memberLvList[i].discount > that.data.distribeDo.discount) {
                flag=true
                break
              }
              else{
                flag=false
              }
            }
            if (flag) {
              wx.redirectTo({
                url: '../membershioup/membershioup?name=' + that.data.distribeDo.name + '&face=' + that.data.memberDo.face,
              })
            }
            else {
              wx.showToast({
                title: '您已是最高等级',
                icon:"none"
              })
            }
          }
        }
      })
    }
    else{
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }  
  },
  jumpputforward:function(e){
    var that=this;
    if (that.data.distribeDo.balance==0){
      wx.showToast({
        title: '账号余额不足',
        icon:"none"
      })
    }
    else{
      wx.redirectTo({
        url: '../putforward/putforward?balance=' + that.data.distribeDo.balance + '&cardno=' + that.data.distribeDo.cardno + '&depositBank=' + that.data.distribeDo.depositBank,
      })
    }
  
  },
})