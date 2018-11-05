const request = require('../../utils/request.js')
const util = require('../../utils/util.js')
Component({

  behaviors: [],

  properties: {
    tuijian_list:Array,
    hasMore:Boolean,
    ImageWidth:String
  },
  data: {
    tuijian_list: [],
    ImageWidth: '',
    offset: 0,
    hasMore: true,
    hasMoreMsg: true,
    msgOpenClose: "展开",
    openClose: "全文",
    msg: '回复',
    canMsg: false,
    postMsg: '',
    composeId: '',
    placeholder: "发表评论",
    msgtype: 0,
    tomemberid: '',
    commentId: '',
    applyname: '',
    innermsgIndex: ''
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { },
  moved: function () { },
  detached: function () { },

  methods: {
   jumpseeDetail: function (e) {
      wx.navigateTo({
        url: '../seedetail/seedetail?postid=' + e.currentTarget.dataset.postid,
      })
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
        index: e.currentTarget.dataset.index,
        postinfoid: e.currentTarget.dataset.postid
      })
    },
    showApply: function (e) {
      var that = this;
      that.setData({
        placeholder: "发表评论",
        canMsg: true,
        postinfoid: e.currentTarget.dataset.postid,
        index: e.currentTarget.dataset.index,
        msgtype: 0,
        templeteMemberId: e.currentTarget.dataset.memberid
      })
    },
    hiddenApply: function () {
      var that = this;
      that.setData({
        canMsg: false,
      })
    },
    zanRequest: function (status, index) {
      var that = this
      let data = {};
      data.postInfoId = that.data.tuijian_list[index].postinfoid,
        data.memberId = wx.getStorageSync('memberId'),
        data.status = status
      request.morepost('/api/bbs/dianzan', data).then(function (res) {
        if (res.code == 0) {
          let key = "tuijian_list[" + index + "].like"
          if (that.data.tuijian_list[index].like) {
            // 已经点过赞了，要取消赞
            wx.showToast({
              title: '取消点赞',
              icon: 'none',
              duration: 1000
            })
            var zanArry = that.data.tuijian_list[index].zanDOList.filter(f => f.memberId != wx.getStorageSync('memberId'))
            let key = "tuijian_list[" + index + "].zanDOList"
            that.setData({
              [key]: zanArry
            })
          } else {
            // 未点赞，需点赞
            wx.showToast({
              title: '点赞成功',
              icon: 'none',
              duration: 1000
            })
            let dianzan = {}
            let key = "tuijian_list[" + index + "].zanDOList"
            dianzan.face = wx.getStorageSync('face')
            dianzan.memberId = wx.getStorageSync('memberId')
            that.data.tuijian_list[index].zanDOList.push(dianzan)
            that.setData({
              [key]: that.data.tuijian_list[index].zanDOList
            })
          }
          that.setData({
            [key]: !that.data.tuijian_list[index].like
          })
        }
      })
    },
    zan: function (e) {
      var that = this
      let index = e.currentTarget.dataset.index
      that.zanRequest(1, index)
    },
    quxiaoZan: function (e) {
      var that = this;
      let index = e.currentTarget.dataset.index
      that.zanRequest(0, index)
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
      params.composeId = that.data.postinfoid;
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
          commment.uname = wx.getStorageSync('uname')
          that.data.tuijian_list[that.data.index].commentDOList.unshift(commment)
          that.setData({
            postMsg: '',
            composeId: '',
            canMsg: false,
            tuijian_list: that.data.tuijian_list
          })
        }
        let formdata = {}
        formdata.memberId = that.data.templeteMemberId
        return request.moregets('/api/push/getFormid', formdata)
      }).then(function (res) {
        let openId = res.openId;
        let form_id = res.formid;
        util.sendMessage(openId, form_id, content, that.data.commentId)
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
        if (res.code == 0) {
          let applyobj = {}
          applyobj.content = content
          applyobj.fromUname = wx.getStorageSync('uname')
          applyobj.uname = that.data.applyname
          console.log(that.data.index)
          console.log(that.data.innermsgIndex)
          that.data.tuijian_list[that.data.index].commentDOList[that.data.innermsgIndex].replyDOList.unshift(applyobj)
          wx.showToast({
            title: '回复成功',
            icon: 'none',
            duration: 1000
          })
          that.setData({
            canMsg: false,
            postMsg: '',
            tuijian_list: that.data.tuijian_list
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
    openClose: function () {
      var that = this;
      if (that.data.openClose == "全文") {
        that.setData({
          openClose: '收起'
        })
      }
      else {
        that.setData({
          openClose: '全文'
        })
      }
    },
    msgOpenClose: function () {
      var that = this;
      if (that.data.msgOpenClose == "展开") {
        that.setData({
          msgOpenClose: '收起'
        })
      }
      else {
        that.setData({
          msgOpenClose: '展开'
        })
      }
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
  }

})