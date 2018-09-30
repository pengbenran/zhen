var api = getApp().globalData.api;
const request=require('../../utils/request.js')

Page({


  data: {
    face:'',
    address:''
  },

  onLoad: function (options) {
    this.setData({
      face: wx.getStorageSync('face')
    })
   
   //表单提交数据



  },
  //定位获取所在地
  bindaddress:function(){
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res)
        that.setData({
          address:res.address
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

//表单提交数据
  fromsub:function(e){
    let businesscardDo={}
    let parms = {}
    let url ='/api/businessCard/submitDate'
    //获取memberId
    let memberId = wx.getStorageSync('memberId');
    parms.mermberid = memberId
    parms.cardname = e.detail.value.name
    parms.companys = e.detail.value.gs
    parms.departments = e.detail.value.bm
    parms.jobs = e.detail.value.zw
    parms.contents = e.detail.value.wofuze
    parms.region = e.detail.value.address
    parms.industry = e.detail.value.hy
    businesscardDo.businesscardDo = parms;
    console.log(businesscardDo);
    //判断数据是否为空
    if (e.detail.value.name==''){
      wx.showToast({
        title: '姓名不能为空',
        icon: 'loading'
      })
    } else if (e.detail.value.gs == ''){
      wx.showToast({
        title: '公司不能为空',
        icon: 'loading'
      })
    } else if (e.detail.value.bm == '') {
      wx.showToast({
        title: '部门不能为空',
        icon: 'loading'
      })
    } else if (e.detail.value.zw == '') {
      wx.showToast({
        title: '职位不能为空',
        icon: 'loading'
      })
    } else if (e.detail.value.wofuze == '') {
      wx.showToast({
        title: '职责不能为空',
        icon: 'loading'
      })
    } else if (e.detail.value.address == '') {
      wx.showToast({
        title: '地址不能为空',
        icon: 'loading'
      })
    } else if (e.detail.value.hy == '') {
      wx.showToast({
        title: '行业不能为空',
        icon: 'loading'
      })
    }else{
      //请求提交数据

      let msg = request.post(url, JSON.stringify(businesscardDo))
      msg.then(function (res) { 
        if (res.code==0){
          request.showSuccess('保存成功','../mycard/mycard')
        }
      })
    }
    

  }

})