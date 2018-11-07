var apimg = getApp().globalData.apimg;
const request = require('../../utils/request.js')

Page({
  data: {
    cardbg: apimg + "/image/card/cardbg.png",
    boxbool:true,
    face:'',
    list: [{ name: '我的人气',num:0, image: apimg + "/image/card/ren.png", url:'../cardlike/cardlike'},
      { name: '我的点赞', num: 0, image: apimg + "/image/card/zan.png", url: '../cardlike/cardlike'},
      { name: '谁关注我', num: 0, image: apimg + "/image/card/chang.png", url: '../cardguanzhu/cardguanzhu' }
    ],
    userinfo:[],
    painting:{},
    shareImage:'',
    qcode:'',
    maskmodel:false
  },
  
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题中显示加载
    
    this.onShow();
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },

  onLoad: function (options) {
    
   this.setData({
     face: wx.getStorageSync('face')
   })
  },

  onShow:function(){
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
  let data = { memberId: memberId}
  request.moregets(url, data).then(function (res) {
    request.moregets(url, data).then(function (res) {
      if (res.code==0){
        var num1 = 'list[0].num';
        var num2 = 'list[1].num';
        var num3 = 'list[2].num';
           that.setData({
             boxbool:false,
             userinfo: res.CardDate, 
             [num1]: res.CardDate.clicks, 
             [num2]: res.CardDate.praise,
             [num3]: res.CardDate.attention,
           })
        console.log('获取用户数据',res.CardDate);
        wx: wx.setStorageSync('CardDate', res.CardDate)
       }

    })
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
  toCardimg:function(){
    let that=this;
    if (!that.data.boxbool){
      wx.navigateTo({
        url: '../cardimg/cardimg',
      })
    }else{
      request.tip('你还未录入个人信息','loading')
    }
    

  },
  //跳转
  tonext:function(e){
    let that=this;
    let url = e.currentTarget.dataset.url; //获取跳转路径
    let name = e.currentTarget.dataset.name; 
    let memberId = wx.getStorageSync('memberId')
    wx.navigateTo({
      url: url + '?name=' + name + '&cardid=' + that.data.userinfo.cardid + '&memberId=' + memberId,
    })
  },

  //关闭海报
  guanbi:function(){
   let that=this;
   that.setData({
     maskmodel:false
   })
  },


  // eventSave() {
  //   wx.saveImageToPhotosAlbum({
  //     filePath: this.data.shareImage,
  //     success(res) {
  //       wx.showToast({
  //         title: '保存图片成功',
  //         icon: 'success',
  //         duration: 2000
  //       })
  //     }
  //   })
  // },
  // eventGetImage(event) {
  //   console.log(event)
  //   wx.hideLoading()
  //   const { tempFilePath, errMsg } = event.detail
  //   if (errMsg === 'canvasdrawer:ok') {
  //     this.setData({
  //       shareImage: tempFilePath
  //     })
  //   }
  // }

})