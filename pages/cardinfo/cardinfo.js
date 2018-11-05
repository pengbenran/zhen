var apimg = getApp().globalData.apimg;
const request = require('../../utils/request.js')

Page({
  data: {
    "cardbg": [apimg + "/image/card/cardbg.png"],
    userinfo:{},
    carid:0,
    memberId:0,  //此处是当前用户ID
    memberIds:0,
    btn0:false,
    btn1: false,
    list: [{ name: '人气', num: 0, image: apimg + "/image/card/ren.png", url: '../cardlike/cardlike' },
    { name: '点赞', num: 0, image: apimg + "/image/card/zan.png", url: '../cardlike/cardlike' },
    { name: '关注', num: 0, image: apimg + "/image/card/chang.png", url: '../cardguanzhu/cardguanzhu' }
    ]
  },
  
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题中显示加载
    this.onLoad();
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },


  onLoad: function (options) {
   
    let dqmemberId = wx.getStorageSync('memberId')

    //增加人气
    this.setData({
      memberId: dqmemberId,
      memberIds: options.memberId
    })
    
  },

  onShow:function(){
    let that=this;
    if (that.data.memberId == that.data.memberIds){
      request.showModels('您正在查看自己的名片', '../mycard/mycard', '../my/my')
    } else if (!that.data.memberId) {
      request.showModels('请先登录', '../my/my', '../my/my')
    } else if (that.data.memberId == '00') {
      request.showModels('您还没有登录', '../my/my', '../my/my')
    } else {
      //初始化数据（页面传参的用户id）
      that.onloads(that.data.memberIds);
      //判断关注返回值
      that.tionbool();
    }
  },
   
 //判断是否已关注
  tionbool:function(){
    let that=this;
    let url ='/api/businessCard/whetherGuanzhu'
    let data = { cardId: that.data.carid, focusMemberId: that.data.memberId }
    request.moregets(url, data).then(function (res) {
      console.log('判断关注返回值', res);
      if(res.code==1){
         that.setData({
           btn1:true
         })
      }
    })
  },

 //初始化请求数据
  onloads: function (memberId) {
    let that = this;
    let url = '/api/businessCard/getCardDate'
    let data = { memberId: memberId}
    request.moregets(url, data).then(function (res) {
      if (res.code == 0) {
        var num1 = 'list[0].num';
        var num2 = 'list[1].num';
        var num3 = 'list[2].num';
        that.setData({
          userinfo: res.CardDate,
          [num1]: res.CardDate.industryid,
          [num2]: res.CardDate.praise,
          [num3]: res.CardDate.attention,
          carid: res.CardDate.cardid
        })
        console.log('获得的初始化数据',res)
      }else if(res.code==1){
        request.showSuccess('此人未创建名片','../mycard/mycard')
      }
    }).then(function (){
      //查看增加人气
      that.renqi(that.data.carid)
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
        console.log('增加人气', res)
      }) 
   }
  },

  //点赞
  zan: function () {
    let that=this;
    let url ='/api/businessCard/dianzanCard'
    console.log(that.data.carid)
    let data = { cardId: that.data.carid, likeMemberId: that.data.memberId}
    //请求数据
    request.moregets(url, data).then(function(res){
      console.log(res);
      that.setData({
        btn0:true
      })
      request.tip('点赞成功', 'loading')
    })
  },

  //点击关注
  tion:function(){
    let that=this;
    let url ='/api/businessCard/guanzhuCard'
    let data = { cardId: that.data.carid, focusMemberId: that.data.memberId}
    request.moregets(url, data).then(function (res) {
      //点击数据刷新
      that.onShow();
      if(res.code==1){
        request.tip('您已关注','loading')
      }else if(res.code==0){
        request.tip('关注成功', 'loading')
      }
    })
  },

  infonext:function(){
    console.log("666")
    wx.switchTab({
      url: '../index/index',
    })
  },

  //发送名片给好友
  onShareAppMessage: function () {
    let that = this;
    console.log('名片分享')
    return {
      path: '/pages/cardinfo/cardinfo?memberId=' + this.data.memberIds
    }
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