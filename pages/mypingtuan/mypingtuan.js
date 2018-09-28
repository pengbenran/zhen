var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    memberId:'',
    swipers:apimg+"/image/treeyiqi/tu1.png",
    down:apimg+"/image/treeyiqi/tu1.png",
    spot:apimg+"/image/treeyiqi/tu1.png",
    currentTab: 0,
    //全部
    mytuanData: [
    ]
    //等待拼团
  },
  
onLoad:function(){
  var that = this
  var memberId = wx.getStorageSync('memberId')
  that.setData({
    memberId: memberId,
  }) 
  wx.request({
    url: api+'/api/collage/allMemberCollage',
    data: {
      memberId: that.data.memberId
    },
    headers: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      that.setData({
        mytuanData:res.data,   
      })  
    },
  })
  wx.getSystemInfo({
    success: function (res) {
      that.setData({
        scrollHeight: res.windowHeight
      });
    }
  });
},

//拼团详情跳转参团成功页面
cantuan: function (e) {
  let that = this;
  let idx = e.currentTarget.id
  let pingtuanObj = that.data.mytuanData[idx]
  var parmss = {}
  parmss.price = pingtuanObj.goodsPrice
  parmss.activityPrice = pingtuanObj.activityPrice
  parmss.goodsId = pingtuanObj.goodsId
  parmss.goodsName = pingtuanObj.goodsName
  parmss.iscollage = pingtuanObj.isCollage
  parmss.memberCollageId = pingtuanObj.memberCollageId
  parmss.img = pingtuanObj.thumbnail
  parmss.shortPerson = pingtuanObj.shortPerson
  parmss.collageGoodsId = pingtuanObj.collageGoodsId
  parmss= JSON.stringify(parmss)
 wx.navigateTo({
    url: '../cantuan/cantuan?shops= ' + parmss,
  })
},
//开团页面跳转  
  pin: function (e) {
    let that=this;
    let idx=e.currentTarget.id
    let pingtuanObj=that.data.mytuanData[idx]
    wx.navigateTo({
      url: '../pintuanxiangqing/pintuanxiangqing?collageGoodsId=' + pingtuanObj.collageGoodsId + '&goodsId=' + pingtuanObj.goodsId,
    })
},

//再次开团跳转  
  qing: function () {
    wx.switchTab({
      url: '../active/active',
    })
  },
//数据遍历
  onShareAppMessage: function () {
    var that = this
    var fenxiangpingtuan = {}
    fenxiangpingtuan = that.data.pingtuandetail
    fenxiangpingtuan.memberId = that.data.memberId
    fenxiangpingtuan = JSON.stringify(fenxiangpingtuan)
    return {
      path: '/pages/join/join?fenxiangpingtuan=' + fenxiangpingtuan,
    }
  },  
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTba: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    if (e.target.dataset.current == 0){
      wx.request({
        url: api + '/api/collage/allMemberCollage',
        data: {
          memberId: that.data.memberId
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          that.setData({
            mytuanData: res.data
          })
        },
        fail: function () {
         

        }
      })
    }
    if (e.target.dataset.current == 1) {
      wx.request({
        url: api + '/api/collage/waitMemberCollage',
        data: {
          memberId: that.data.memberId
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          that.setData({
            mytuanData: res.data
          })
        },
        fail: function () {

        }
      })
    }
    if (e.target.dataset.current == 2) {
      wx.request({
        url: api + '/api/collage/succeedMemberCollage',
        data: {
          memberId: that.data.memberId
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          that.setData({
            mytuanData: res.data
          })
        },
        fail: function () {

        }
      })
    }

    if (e.target.dataset.current == 3) {
      wx.request({
        url: api + '/api/collage/failMemberCollage',
        data: {
          memberId: that.data.memberId
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          that.setData({
            mytuanData: res.data
          })
        },
        fail: function () {

        }
      })
    }
  },
  //商城 定制 资讯 tab 切换事件
  OnTabChangeEvent(event) {
    var current = event.detail.current;
    this.setData({
      currentTab: current
    });
  },
})