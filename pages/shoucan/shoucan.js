var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    foot:apimg+"/images/shoucan/wyuan.png",
    "guanimg": [apimg+"/images/shoucan/fandajing.png"],
    "guoimg": [apimg+"/images/shoucan/wyuan.png"],
    commo: [
    ],
    hasList: true,
    selectAllStatus: false  ,
    "inEditMode": false,
    selected: true,
    "selects": [],
  },

  // 刷新
  onPullDownRefresh() {

    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    this.onLoad();
  },
  onShareAppMessage: function () {
    withShareTicket: true
  },
  tiao:function(e){
    var that = this
    var goodsId = e.currentTarget.id
    wx.navigateTo({
      url: '../group/group?goodid=' + goodsId,
    })
  },
  onLoad:function(){
    var that = this
    var parms = {}
    parms.memberId = wx.getStorageSync('memberId')
    wx.request({
      url:api + '/api/favorite/get',
      data: {
        "parms": parms
      },
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        that.setData({
          FavoriteList: res.data.FavoriteList
        })
        if (res.data.code == 1) {
          that.setData({
            hasList: false
          })
        } else {
          that.setData({
            hasList: true
          })
        }
      }
      
    })
  },


  // 搜索跳转js
  sousuo: function (e) {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  // 商品详情页面跳转
  swiperbind: function (e) {
    wx.navigateTo({
      url: '../group/group',
    })
  },
  // 点击管理m
  changeMode: function () {
    if (this.data.inEditMode) {
      this.setData({
        "inEditMode": false
      });
    } else {
      this.setData({
        "inEditMode": true
      });
    }
  },
  // 选中或者不选
  selectList(e) {
    this.data.selects = e.target.id;
    const index = e.currentTarget.dataset.index;
    let FavoriteList = this.data.FavoriteList;
    const selected = FavoriteList[index].selected;
    FavoriteList[index].selected = !selected;
    this.setData({
      FavoriteList: this.data.FavoriteList

    });
    console.log(this.data.FavoriteList)
  },

  // 
  // 购物车全选事件
  selectAll(e) {
    var selected = this.data.selected
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let FavoriteList = this.data.FavoriteList;
    for (let i = 0; i < FavoriteList.length; i++) {
      FavoriteList[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      FavoriteList: this.data.FavoriteList,
    });
  },

  // 删除事件
 
  deled: function (e) {
    var parms = {}
    var favdel = []
    var edit = this.data.edit
    var FavoriteList = this.data.FavoriteList
    var cart = {}
    for (let i = 0; i < this.data.FavoriteList.length; i++) {         // 循环列表得到每个数据
      if (this.data.FavoriteList[i].selected) {                     // 判断选中
        favdel.push(this.data.FavoriteList[i].favoriteId)
      }
    }
    parms.favoriteIds = favdel
    parms = JSON.stringify(parms)
    var that = this
    wx.request({
      url: api + '/api/favorite/deletelist',
      data: {
        "parms": parms
      },
      method: "POST",
      header: {

        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          FavoriteList: FavoriteList,
          selectAllStatus: false,
          edit: !edit,

        })
        that.onLoad()
      }

    })
  }
})