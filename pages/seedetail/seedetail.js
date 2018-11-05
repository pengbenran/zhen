// pages/seedetail/seedetail.js
const request = require('../../utils/request.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zanDOList:[],
    commentDOList:[],
    composeDO:[],
    ImageWidth:'',
    canMsg: false,
    composeId: '',
    placeholder: "发表评论",
    msgtype: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ImageWidth: (res.screenWidth -47) / 3 + 'px',
        })
      }
    })
    that.getCompose(options.postid)
  },
  previewImg: function (e) {
    var that = this
    let imgArr = []
    let outindex = e.currentTarget.dataset.outindex
    let innerindex = e.currentTarget.dataset.innerindex
    console.log(outindex)
    for (var i in that.data.tuijian_list[outindex].imagesDOList) {
      imgArr.push(that.data.tuijian_list[outindex].imagesDOList[i].imgpath)
    }
    wx.previewImage({
      current: that.data.tuijian_list[outindex].imagesDOList[innerindex].imgpath,     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getCompose: function (postInfoId) {
    let that = this;
    wx.request({
      url: 'http://192.168.2.208/mall/api/bbs/getCompose',
      data: {
        memberId: wx.getStorageSync('memberId'),
        postInfoId: postInfoId
        // postInfoId: 34
      },
      success: function (res) {
        console.log(res)
        var timestamp = (new Date()).valueOf();
        let leaveTime = timestamp - res.data.composeDO.posttime
        if (leaveTime > 1000 * 3600 * 24) {
          res.data.composeDO.posttime = Math.floor(leaveTime / (1000 * 3600 * 24)) + "天前"
        }
        else if (leaveTime > (1000 * 3600) && leaveTime < (1000 * 3600 * 24)) {
          res.data.composeDO.posttime = Math.floor(leaveTime / (1000 * 3600)) + '小时前'
        }
        else if (leaveTime > (1000 * 60) && leaveTime < (1000 * 3600)) {
          res.data.composeDO.posttime = Math.floor(leaveTime / (1000 * 60)) + '分钟前'
        }
        else {
          res.data.composeDO.posttime = "刚刚"
        }
        that.setData({
          zanDOList: res.data.zanDOList,
          commentDOList: res.data.commentDOList,
          composeDO: res.data.composeDO,
        })
      }
    })
  },
  zanRequest: function (status) {
    var that = this
    wx.request({
      url: 'http://192.168.2.208/mall/api/bbs/dianzan',
      data: {
        postInfoId: that.data.composeDO.postinfoid,
        memberId: wx.getStorageSync('memberId'),
        status: status
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          let key = "composeDO.like"
          if (that.data.composeDO.like) {
            // 已经点过赞了，要取消赞
            wx.showToast({
              title: '取消点赞',
              icon: 'none',
              duration: 1000
            })
            var zanArry = that.data.zanDOList.filter(f => f.memberId != wx.getStorageSync('memberId'))
            that.setData({
              zanDOList: zanArry
            })
          } else {
            // 未点赞，需点赞
            wx.showToast({
              title: '点赞成功',
              icon: 'none',
              duration: 1000
            })
            let dianzan = {}
            dianzan.face = wx.getStorageSync('face')
            dianzan.memberId = wx.getStorageSync('memberId')
            that.data.zanDOList.push(dianzan)
            that.setData({
              zanDOList: that.data.zanDOList
            })
          }
          that.setData({
            [key]: !that.data.composeDO.like
          })
        }
      }
    })
  },
  zan: function (e) {
    var that = this
    that.zanRequest(1)
  },
  quxiaoZan: function (e) {
    var that = this;
    that.zanRequest(0)
  },
  apply: function (e) {
    var that = this;
    that.setData({
      msgtype: 1
    })
    that.setData({
      placeholder: `回复${e.currentTarget.dataset.applyname}:`,
      canMsg: true,
      applyname: e.currentTarget.dataset.applyname,
      commentId: e.currentTarget.dataset.id,
      tomemberid: e.currentTarget.dataset.tomemberid,
      innermsgIndex: e.currentTarget.dataset.innermsgindex,
      postinfoid: e.currentTarget.dataset.postid
    })
  },
  showApply: function (e) {
    var that = this;
    that.setData({
      placeholder: "发表评论",
      canMsg: true,
      msgtype: 0
    })
  },
  hiddenApply: function () {
    var that = this;
    that.setData({
      canMsg: false,
    })
  },
  postMsg: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍等',
    })
    if (that.data.msgtype == 1) {
      that.appleyRequest(that.data.tomemberid, that.data.commentId, e.detail.value)
    }
    else {
      that.msgRequest(e.detail.value)
    }
  },
  msgRequest: function (content) {
    let params = {};
    let data = {};
    let that = this;
    params.composeId = that.data.composeId;
    params.content = content;
    params.memberId = wx.getStorageSync('memberId')
    data.params = JSON.stringify(params)
    request.morepost('/api/bbs/comment', data).then(function (res) {
      if (res.code == 0) {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
          icon: 'none',
          duration: 1000
        })
        let commment = {}
        commment.content = content
        commment.face = wx.getStorageSync('face')
        commment.uname = wx.getStorageSync('uname')
        that.data.commentDOList.unshift(commment)
        that.setData({
          postMsg: '',
          canMsg: false,
          commentDOList: that.data.commentDOList
        })
      }
      let formdata = {}
      formdata.memberId = that.data.composeDO.memberid
      return request.moregets('/api/push/getFormid', formdata)
    }).then(function (res) {
      let openId = res.openId;
      let form_id = res.formid;
      util.sendMessage(openId, form_id, content, that.data.composeDO.postinfoid)
    })
  },
  appleyRequest(toMemberid, commentId, content) {
    var that = this;
    let data = {};
    data.replyType = 1
    data.fromMemberid = wx.getStorageSync('memberId')
    data.replyId = toMemberid
    data.commentId = commentId
    data.content = content
    request.morepost('/api/bbs/reply', data).then(function (res) {
      wx.hideLoading()
      if (res.data.code == 0) {
        let applyobj = {}
        applyobj.content = content
        applyobj.fromUname = wx.getStorageSync('uname')
        applyobj.uname = that.data.applyname
        that.data.commentDOList[that.data.innermsgIndex].replyDOList.unshift(applyobj)
        wx.showToast({
          title: '回复成功',
          icon: 'none',
          duration: 1000
        })
        that.setData({
          canMsg: false,
          postMsg: '',
          commentDOList: that.data.commentDOList
        })
      }
      let formdata = {}
      formdata.memberId = toMemberid
      return request.moregets('/api/push/getFormid', formdata)
    }).then(function (res) {
      let openId = res.openId;
      let form_id = res.formid;
      util.sendMsgApply(openId, form_id, content, that.data.postinfoid)
    })
  },
  /**
   * 
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  }
})