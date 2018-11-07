// pages/addDynamic/addDynamic.js
var apimg = getApp().globalData.apimg;
const request = require('../../utils/request.js')
Page({
  data: {
    tempFilePaths:[],
    ImageWidth:'',
    payimg: apimg + "/images/quzhifu/dizhi.png",
    clor: apimg + "/image/wode/kao6.png",
    add: apimg+"/image/add.png",
    addressImg: apimg +"/image/address.png",
    address:'请选择地址',
    longitude:'',
    latitude:'',
    postcontent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ImageWidth: (res.screenWidth-45)/4+'px',
        })
      }
    })

  },
  chooseImg:function(){
    var that=this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFilePaths
        let tempFile=[]
        tempFile=res.tempFilePaths.concat(that.data.tempFilePaths)
        that.setData({
          tempFilePaths:tempFile
        })
      }
    })
  },
  chooseAddr:function(){
    var that=this
    wx.chooseLocation({
      success(res){
        that.setData({
          address:res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  uploadImg:function(){
    return new Promise((resolve, reject) => {
      var that = this
      wx.showToast({
        title: '正在上传...',
        icon: 'loading',
        mask: true,
        duration: 10000
      })
      var uploadImgCount = 0;
      var imgUrl = [];
      if (that.data.tempFilePaths.length>0){
        for (var i = 0; i < that.data.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: 'https://www.guqinet.com:8444/uploadBbs/weChatImage',
            filePath: that.data.tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              imgUrl.push(res.data)
              //如果是最后一张,则隐藏等待中
              if (uploadImgCount == that.data.tempFilePaths.length) {
                resolve(imgUrl)
                wx.hideToast();
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
      else{
        resolve(imgUrl)
      }
    })
  },
  getContent:function(e){
    var that=this;
    that.setData({
      postcontent:e.detail.value
    })
  },
  btn:function(){
    var that=this
    let address=''
    if (that.data.address =="请选择地址"){
      address=""
    }else{
      address=that.data.address
    }
    request.gets('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=w11RrR3kcKOyAktr4EuKzo1f&client_secret=rFHSucobN6MGiwc9mafSnbppjdHFoY5D').then(function (res) {
      let content = {}
      content.content = that.data.postcontent
      return request.post('https://aip.baidubce.com/rest/2.0/antispam/v2/spam?access_token=' + res.access_token, content)
    }).then(function (res) {
      if (res.result.spam == 0) {
        that.uploadImg().then((res) => {
          var imgPath = res
          let data={}
          data.memberid= wx.getStorageSync('memberId')
          data.postcontent= that.data.postcontent
          data.postaddre= address
          data.posttype=1
          data.local= that.data.latitude + "," + that.data.longitude
          data.istop= 0
          data.lookcounts= 0
          data.sorts= 0
          data.praise= 0
          data.imgPath= imgPath
          request.morepost('/api/bbs/from',data).then(function(res){
            if (res.code == 0) {
              wx.showToast({
                title: '发布成功',
              })
              wx.switchTab({
                url: '../see/see',
                success: function (e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
              })
            }
          })
        })
      }
      else{
        wx.showToast({
          title: '内容包含敏感词',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})