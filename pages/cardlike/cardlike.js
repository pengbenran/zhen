var apimg = getApp().globalData.apimg;
const request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    likebool:true,
    weiimg: apimg + "/image/card/weixin.png",
    face:'',
    bartitle:'',
    listfont:'',
    wholikeme:[],
    ilike:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置标题
    wx.setNavigationBarTitle({
      title: options.name
    })
    let memberId = wx.getStorageSync('memberId');
    this.setData({
      face: wx.getStorageSync('face'),
      bartitle: options.name,
      cardid: options.cardid,
      memberId: memberId
    })

    //加载初始化数据
    this.onloads();    
  },
   
  //获取初始化数据
  onloads:function(){
    let that=this;
    let bartitle = this.data.bartitle;
    if (bartitle=='人气'){
    that.setData({
      listfont:'看'
    })
    let url ='/api/businessCard/dianzanClick'  
    let data = { cardId: that.data.cardid, likeMemberId: that.data.memberId}
      request.moregets(url, data).then(function(res){
        console.log(res,'获得谁看我的数据')
        that.setData({
          wholikeme: res.whoLikeMe,
          ilike: res.iLike
        })
      })
    } else if (bartitle=='点赞'){
      that.setData({
        listfont: '赞'
      })
    }
  },

  tocardinfo:function(){
    wx.navigateTo({
      url: '../cardinfo/cardinfo',
    })
  }


})