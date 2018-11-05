var apimg = getApp().globalData.apimg;
const request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    likebool:true,
    listtop: [{ names: '谁看过我', topbool: true }, { names: '我看过谁', topbool: false }],
    weiimg: apimg + "/image/card/weixin.png",
    indexs:0,
    face:'',
    bartitle:'',
    listfont:'',
    wholikeme:[],
    ilike:[],
    whoLookMe:[],
    iLook:[]
    
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

  
  },
  
  onShow:function(){
    //加载初始化数据
    this.onloads();    
  },
   
  //获取初始化数据
  onloads:function(){
    let that=this;
    let bartitle = this.data.bartitle;
    console.log(bartitle,'7777');
    if (bartitle=='我的人气'){ //获取人气数据
      let url ='/api/businessCard/renqiClick'
      let data = { cardId: that.data.cardid, memberId: that.data.memberId}
      that.more(url, data, function (res) {
        console.log(777,res);
        that.setData({
          whoLookMe: res.whoLookMe,
          iLook: res.iLook
        })
        console.log('888', that.data.iLook);
      })

    } else if (bartitle=='我的点赞'){ //获取点赞数据
      var str1 = 'listtop[0].names'
      var str2 = 'listtop[1].names'
      that.setData({
        [str1]:'谁赞过我',
        [str2]:'我赞过谁'
      })

      let url = '/api/businessCard/dianzanClick'
      let data = { cardId: that.data.cardid, likeMemberId: that.data.memberId }
      that.more(url, data,function(res){
        console.log(888,res)
        that.setData({
          wholikeme:res.whoLikeMe,
          ilike: res.iLike,
        })
        console.log('666',res);
      })
    }
  },

  //请求方法
  more:function(url,data,callback){
    request.moregets(url, data).then(function (res) {
      console.log(res, '获取数据')
      callback(res)
    })
  },

  seleclickTab:function(e){
     console.log(e)
     let that=this;
     let indexs = e.currentTarget.dataset.index;
    that.data.listtop.forEach(function(item,index,arr){
      var str = 'listtop[' + index +'].topbool'
      if (indexs==index){
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

  tocardinfo:function(e){
    let that=this;
    let cardid = e.currentTarget.dataset.cardid;
    let merberid = e.currentTarget.dataset.merberid;
    console.log(e)
    console.log(cardid, merberid)
    wx.navigateTo({
      url: '../cardinfo/cardinfo?cardid=' + cardid + '&memberId=' + merberid,
    })
  }


})