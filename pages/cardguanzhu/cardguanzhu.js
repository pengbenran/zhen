var apimg = getApp().globalData.apimg;
const request = require('../../utils/request.js')

Page({

  data: {
    likebool: true,
    weiimg: apimg + "/image/card/weixin.png",
    face: '',
    listtop: [{ names: '谁关注我', topbool: true }, { names: '我关注谁', topbool: false }],
    whoFocusMe:[],
    iFocus:[],
    indexs:0
  },

  //下拉刷新
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading() //在标题中显示加载
    
    setTimeout(function(){
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500)
  },

  onLoad: function (options) {
    this.setData({
      face: wx.getStorageSync('face')
    })
    //初始化数据
    this.setData({
      cardId: options.cardid,
      focusMemberId: options.memberId
    })

  },
  
  onShow:function(){
    this.loads('/api/businessCard/guanzhuClick');
  },

  //加载初始化数据
  loads: function (url){
    let that=this;
    let data = { cardId: this.data.cardId, focusMemberId: this.data.focusMemberId}
    that.more(url, data,function(res){
     console.log('初始化后的数据',res)
     that.setData({
       whoFocusMe: res.whoFocusMe,
       iFocus: res.iFocus
     })
    })
  },

  //点击选中
  clickTab:function(e){
  let that=this;
  let indexs = e.currentTarget.dataset.index;
  that.data.listtop.forEach(function(item,index,arr){
    var str = 'listtop[' + index + '].topbool';
    if(indexs==index){
      that.setData({
        [str]: true,
        indexs: indexs
      })
    }else{
      that.setData({
        [str]: false
      })
    }
  }) 
  },
  
  //跳转
  tonext:function(e){
    let that = this;
    let cardid = e.currentTarget.dataset.cardid;
    let merberid = e.currentTarget.dataset.merberid;
    console.log(e)
    console.log(cardid, merberid)
    wx.navigateTo({
      url: '../cardinfo/cardinfo?cardid=' + cardid + '&memberId=' + merberid,
    })
  },


  //取消关注
  close: function (e){
    let that = this;
    let url ='/api/businessCard/quxiaoFocus'
    let cardid = e.currentTarget.dataset.cardid;
    let focusmemberid = e.currentTarget.dataset.focusmemberid;
    let data = { cardId: cardid, focusMemberId: focusmemberid }
    wx.showModal({
      title: '提示',
      content: '是否取消关注',
      success: function (res) {
        if (res.confirm){
          that.more(url, data, function (res) {
            wx.showToast({
              title: '取消成功',
            })
          })
        } else if (res.cancel){
        
        }
      }
    })
   
  },
  

  //请求封装
  more: function (url, data, callback){
    request.moregets(url, data,callback).then(function (res) {
      // console.log('请求成功',res);
      callback(res)
    })
  }

})