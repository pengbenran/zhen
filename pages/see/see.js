// pages/see/see.js
const request = require('../../utils/request.js')
const util = require('../../utils/util.js')
var apimg = getApp().globalData.apimg;
Page({
  data: {
    find_item: [
      { name: "推荐", selected: true },
      { name: "关注", selected: false },
      { name: "身边", selected: false },
      { name: "热帖", selected: false },
      { name: "名片榜", selected: false }],
    tuijian_list: [],
    add: apimg+"/image/add.png",
    bcg: apimg+"/image/bcg.png",
    ImageWidth:'',
    offset:0,
    hasMore:true,
    hasMoreMsg:true,
    msgOpenClose:"展开",
    openClose:"全文",
    msg:'回复',
    canMsg:false,
    postMsg:'',
    composeId:'',
    placeholder:"发表评论",
    msgtype:0,
    tomemberid:'',
    commentId:'',
    applyname:'',
    innermsgIndex:''
  },
  onShow:function(){

  },
  onLoad: function (options) {
    console.log("加载了")
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          tuijian_list: [],
          ImageWidth: (res.screenWidth * 0.95 - 56) / 3 + 'px',
        })
      }
    })
    that.getcomposeList(0, 3)
  },
  getcomposeList: function (offset,limit){
    let params = {};
    let data={};
    let that=this;
    params.offset = offset;
    params.limit = limit;
    params.memberId = wx.getStorageSync('memberId')
    data.params = JSON.stringify(params)
    request.moregets('/api/bbs/composeList', data).then(function (res) {
      console.log(res)
      var timestamp = (new Date()).valueOf();
      for (var i in res.rows) {
        let leaveTime = timestamp - res.rows[i].posttime
        res.rows.focus = false
        if (leaveTime > 1000 * 3600 * 24) {
          res.rows[i].posttime = Math.floor(leaveTime / (1000 * 3600 * 24)) + "天前"
        }
        else if (leaveTime > (1000 * 3600) && leaveTime < (1000 * 3600 * 24)) {
          res.rows[i].posttime = Math.floor(leaveTime / (1000 * 3600)) + '小时前'
        }
        else if (leaveTime > (1000 * 60) && leaveTime < (1000 * 3600)) {
          res.rows[i].posttime = Math.floor(leaveTime / (1000 * 60)) + '分钟前'
        }
        else {
          res.rows[i].posttime = "刚刚"
        }
      }
      let composeList = []
      composeList = that.data.tuijian_list.concat(res.rows)
      if (res.rows.length < limit) {
        that.setData({
          hasMore: false
        })
      }
      else {
        that.setData({
          hasMore: true
        })
      }
      that.setData({
        tuijian_list: composeList
      })

      wx.hideLoading();
    })
  },

  jumpAddDynamic:function(){
    wx.navigateTo({
      url: '../addDynamic/addDynamic',
    })
  },
 
  changTab:function(e){
    var that=this;
    let key=""
    for(var i in that.data.find_item){
      key="find_item["+i+"].selected"
      that.setData({
        [key]:false
      })
    }
    let keyvalue="find_item["+e.currentTarget.dataset.index+"].selected"
    that.setData({
      [keyvalue]:true
    })
  },
   onReachBottom: function () {
    var that = this;
    // 显示加载图标
    console.log(that.data.hasMore)
    if(that.data.hasMore){
      wx.showLoading({
        title: '玩命加载中',
      })
      that.setData({
        offset: that.data.offset + 1
      })
      that.getcomposeList(that.data.offset, 3)
    }else{

    }
   },
  onPullDownRefresh() {
    var that=this
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
    that.onLoad()
  },
})