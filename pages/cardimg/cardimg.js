// pages/cardimg/cardimg.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
const request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TypeList:[],
    ImgList:[],
    TypeSelectIndex:0,
    selectindex:0,
    imgico: apimg + '/image/card/selsctico.png',
    imgUrl:'',
    maskmodel:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that=this;
    that.onType();
    that.setData({
      face: wx.getStorageSync('face'),
      userinf: wx.getStorageSync('CardDate')
    })
    
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {

  },

  //类型的点击选中
  selectType:function(e){
    let that=this;
    console.log(e,"查看点击传过来的额数据")
    let typeid = e.target.dataset.typeid
    let index = e.target.dataset.index
    that.setData({
      TypeSelectIndex: index
    })
    that.onImgList(typeid)
  },

 //获取类型数据
 onType:function(){
  let that=this;
   request.moregets('/api/businessCard/albumTypeList').then(function(res){
     that.setData({
       TypeList: res.albumTypeList
     })
     that.onImgList(res.albumTypeList[0].id)
   })
 },

 //图片选中事件
  selctTo:function(e){
    
    let that=this;
    let imgurl = e.currentTarget.dataset.imgurl
    let index = e.currentTarget.dataset.indexs
    console.log("shucu", e, e.currentTarget.dataset.imgurl, e.currentTarget.dataset.indexs)
    that.setData({
      selectindex: index+1,
      imgUrl: imgurl
    })
  },

 //获取图片数据
  onImgList: function (typeid){
   let that=this;
   request.moregets('/api/businessCard/getTpyeAlbum', { typeId: typeid }).then(function(res){
     that.setData({
       ImgList: res.albumDOList
     })
     console.log("查看图片数据",res)
   })
 },

 //生成海报
  haibaoClick:function(){
    let that = this;
    if (that.data.selectindex != 0) {
      that.eventDraw();
    } else {
      request.tip("请选择一张图片", "loading")
    }
  },

  //获取输入的文本
  huoqutextarea:function(e){
    let that=this;
    console.log(e);
    that.setData({
      textarea: e.detail.value
    })
  },

  eventDraw: function() {
    this.setData({
      maskmodel: true
    })
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    //请求小程序码
    let that = this;
    let url = 'https://www.guqinet.com:8444/upload/getShare'
    let data = { page: 'pages/index/index', scene: wx.getStorageSync('memberId') }
    request.gets(url, data).then(function (res) {
      console.log('kk',that.data.imgUrl);
      let result1 = request.getImageInfo(that.data.imgUrl)
      let result2 = request.getImageInfo(res)
      Promise.all([result1, result2]).then(function(res){
        console.log(res,"输出一下")
          that.setData({
            painting: {
              width: 375,
              height: 500,
              clear: true,
              views: [
                { type: 'image', url: res[0], top: 0, left: 0, width: 375, height: 500 },
                {
                  type: 'image',
                  url: that.data.face,
                  top: 385,
                  left: 20,
                  width: 48,
                  height: 48
                },
                {
                  type: 'image',
                  url: res[1],
                  top: 392,
                  left: 295,
                  width: 70,
                  height: 70
                },
                {
                  type: 'image',
                  url: '/image/avatar_cover.png',
                  top: 385,
                  left: 20,
                  width: 48,
                  height: 48
                },
                {
                  type: 'text',
                  content: that.data.textarea,
                  fontSize: 14,
                  color: '#666',
                  textAlign: 'left',
                  breakWord: true,
                  width: 305,
                  top: 290,
                  left: 35,
                }
                , {
                  type: 'text',
                  content: that.data.userinf.cardname,
                  fontSize: 23,
                  color: '#666',
                  textAlign: 'left',
                  bolder: true,
                  width: 80,
                  top: 385,
                  left: 70,
                },
                {
                  type: 'text',
                  content: that.data.userinf.departments + "  " + that.data.userinf.jobs,
                  fontSize: 14,
                  color: '#ccc',
                  textAlign: 'left',
                  width: 80,
                  top: 392,
                  left: 140,
                },
                {
                  type: 'text',
                  content: that.data.userinf.companys,
                  fontSize: 14,
                  color: '#ccc',
                  textAlign: 'left',
                  width: 80,
                  top: 417,
                  left: 70,
                },
                {
                  type: 'text',
                  content: "电话：" + that.data.userinf.p1 ,
                  fontSize: 14,
                  color: '#666',
                  textAlign: 'left',
                  width: 200,
                  top: 440,
                  left: 20,
                },
                {
                  type: 'text',
                  content: "地址：" + that.data.userinf.region ,
                  fontSize: 14,
                  breakWord: true,
                  color: '#666',
                  textAlign: 'left',
                  width: 282,
                  top: 460,
                  left: 20,
                },
              ]
            }
          })
      })
      
      console.log('小程序码', that.data.qcode)
    })
  },

  eventGetImage(event) {
    console.log("执行了吗")
    console.log(event)
    wx.hideLoading()

    console.log("s88", event.detail)
    const { tempFilePath, errMsg } = event.detail

    if (errMsg === 'canvasdrawer:ok') {
      this.shareImage = tempFilePath
      wx.previewImage({
        current: tempFilePath, // 当前显示图片的http链接
        urls: [tempFilePath] // 需要预览的图片http链接列表
      })
    }
  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '微鑫云臻',
      desc: '微鑫云臻',
      path: 'pages/intro/main'
    }
  }
})