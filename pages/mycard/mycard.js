var apimg = getApp().globalData.apimg;
const request = require('../../utils/request.js')

Page({
  data: {
    "cardbg": [apimg + "/image/card/cardbg.png"],
    boxbool:true,
    face:'',
    list: [{ name: '人气',num:0, image: apimg + "/image/card/ren.png", url:'../cardlike/cardlike'},
      { name: '点赞', num: 0, image: apimg + "/image/card/zan.png", url: '../cardlike/cardlike' },
      { name: '关注', num: 0, image: apimg + "/image/card/chang.png", url: '../cardguanzhu/cardguanzhu' }
    ],
    userinfo:{}
  },

  onLoad: function (options) {
    // this.face = wx.getStorageSync('face')
    this.setData({
      face: wx.getStorageSync('face')
    })
    //初始化页面请求初始数据
    this.onloads();
  

  },

  onloads:function(){
  let that=this;
  let url ='/api/businessCard/getCardDate'
  let memberId = wx.getStorageSync('memberId') 
  console.log("==数据开请求==")
    request.moregets(url, memberId).then(function (res) {
      if (res.code==0){
        var num1 = 'list[0].num';
        var num2 = 'list[1].num';
        var num3 = 'list[2].num';
           that.setData({
             boxbool:false,
             userinfo: res.CardDate, 
             [num1]: res.CardDate.attention,
             [num2]: res.CardDate.clicks,
             [num3]: res.CardDate.industryid,
           })
        console.log(res.CardDate);
       }

    })
  },
  
  //发送名片给好友
  onShareAppMessage: function () {
    let that=this;
    console.log('名片分享')
    let memberId = wx.getStorageSync('memberId');
    return {
      path: '/pages/cardinfo/cardinfo?memberId=' + memberId + '&cardid=' + that.data.userinfo.cardid,
    }
  },
   

  //跳转至名片信息提交
  tocardfrom:function(){
    wx.navigateTo({
      url: '../cardfrom/cardfrom',
    })
  },
  
  //跳转
  tonext:function(e){
    let that=this;
    let url = e.currentTarget.dataset.url; //获取跳转路径
    let name = e.currentTarget.dataset.name; 
    wx.navigateTo({
      url: url + '?name=' + name + '&cardid=' + that.data.userinfo.cardid,
      
    })
  }
})