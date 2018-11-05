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
  console.log("==数据开请求==")
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

  //生成海报
  eventDraw:function() {
    this.setData({
      maskmodel:true
    })
    //请求小程序码
    let that=this;
    let url ='https://www.guqinet.com:8444/upload/getShare'
    let data = { page: 'pages/index/index', scene: wx.getStorageSync('memberId')}
    request.gets(url, data).then(function(res){
      console.log('kk',res);
      request.getImageInfo(res).then(function(res){
        wx.showLoading({
          title: '绘制分享图片中',
          mask: true
        }),
          that.setData({
            painting: {
              width: 375,
              height: 360,
              clear: true,
              views: [
                {
                  type: 'image',
                  url: '/image/cardbg.png',
                  top: 0,
                  left: 0,
                  width: 375,
                  height: 360
                },
                {
                  type: 'image',
                  url: that.data.face,
                  top: 40,
                  left: 300,
                  width: 40,
                  height: 40
                },
                {
                  type: 'image',
                  url:res ,
                  top: 250,
                  left: 270,
                  width: 100,
                  height: 100
                },
                {
                  type: 'image',
                  url: '/image/avatar_cover.png',
                  top: 40,
                  left: 300,
                  width: 40,
                  height: 40
                },
                {
                  type: 'text',
                  content: that.data.userinfo.cardname,
                  fontSize: 30,
                  color: '#666',
                  textAlign: 'left',
                  top: 35,
                  left: 38,
                },
                {
                  type: 'text',
                  content: that.data.userinfo.departments + "  " + that.data.userinfo.jobs,
                  fontSize: 14,
                  color: '#8e8e8e',
                  textAlign: 'left',
                  top: 75,
                  left: 38,
                },
                {
                  type: 'text',
                  content: that.data.userinfo.companys,
                  fontSize: 14,
                  color: '#8e8e8e',
                  textAlign: 'left',
                  top: 100,
                  left: 38,

                },
                {
                  type: 'text',
                  content: '地址：' + that.data.userinfo.region,
                  fontSize: 13,
                  color: '#666',
                  textAlign: 'left',
                  top: 135,
                  left: 38,

                },
                {
                  type: 'text',
                  content: '电话：' + that.data.userinfo.p1,
                  fontSize: 13,
                  color: '#666',
                  textAlign: 'left',
                  top: 155,
                  left: 38,
                },

                {
                  type: 'text',
                  content: '获取等多人脉',
                  fontSize: 20,
                  color: '#666',
                  textAlign: 'left',
                  top: 275,
                  left: 38,
                },
                {
                  type: 'text',
                  content: '请关注微鑫云臻',
                  fontSize: 16,
                  color: '#666',
                  textAlign: 'left',
                  top: 305,
                  left: 38,
                },
              ]
            }
          })
      })
      console.log('小程序码', that.data.qcode)
    })
    
 
  },
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }
  }

})