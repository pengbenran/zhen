var apimg = getApp().globalData.apimg;
const request = require('../../utils/request.js')

Page({
  data: {
    "cardbg": [apimg + "/image/card/cardbg.png"],
    userinfo:{},
    carid:0,
    memberId:0,
    list: [{ name: '人气', num: 0, image: apimg + "/image/card/ren.png", url: '../cardlike/cardlike' },
    { name: '点赞', num: 0, image: apimg + "/image/card/zan.png", url: '../cardlike/cardlike' },
    { name: '关注', num: 0, image: apimg + "/image/card/chang.png", url: '../cardguanzhu/cardguanzhu' }
    ]
  },


  onLoad: function (options) {0

    //初始化数据
    this.onloads(options.memberId);
    //增加人气
    this.renqi(options.cardid)
    let dqmemberId = wx.getStorageSync('memberId')

    this.setData({
      carid: options.cardid, 
      memberId: dqmemberId
    })
  },


 //初始化请求数据
  onloads: function (memberId) {
    let that = this;
    let url = '/api/businessCard/getCardDate'
    //let memberId = wx.getStorageSync('memberId')
    console.log("==数据开请求==")
    request.onegets(url, memberId).then(function (res) {
      if (res.code == 0) {
        var num1 = 'list[0].num';
        var num2 = 'list[1].num';
        var num3 = 'list[2].num';
        that.setData({
          userinfo: res.CardDate,
          [num1]: res.CardDate.industryid,
          [num2]: res.CardDate.clicks,
          [num3]: res.CardDate.attention,
        })
        console.log(res.CardDate)
      }
    })
  },

  //增加人气
  renqi: function (memberId){
    let lookmemberId = wx.getStorageSync('memberId')
    let url ='/api/businessCard/lookCard'
    let data = { cardId: memberId, lookMemberId: lookmemberId}
    if (!lookmemberId || lookmemberId==''){
      request.showModels('您还没有登录','../my/my','../my/my')
   }else{
      request.moregets(url, data).then(function(res){
        console.log('增加人气')
        console.log(res);
      }) 
   }
  },

  //点赞
  zan: function () {
    let that=this;
    let url ='/api/businessCard/dianzanClick'
    console.log(that.data.carid)
    let data = { cardId: that.data.carid, likeMemberId: that.data.memberId}
    //请求数据
    request.moregets(url, data).then(function(res){
      console.log(res);
      wx.showToast({
        title: '点赞成功',
        icon: 'loading',
        duration: 2000
      })
    })
  },




  //跳转
  tonext: function (e) {
    let that = this;
    let url = e.currentTarget.dataset.url; //获取跳转路径
    wx.navigateTo({
      url: url,
    })
  }


})