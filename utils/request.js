var api = getApp().globalData.api;

//封装一个POST请求
const  post=(url,data)=>{
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      data: data,
      success: res => {       
      resolve(res.data)
      },
    });
  })
}

//封装一个get请求
const gets = (url,data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url:url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data,
      method: 'GET',
      success: res => {
        resolve(res.data)
      },
    });
  })
}



//封装多个get请求
const moregets = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: api + url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'get',
      data: data,
      success: res => {
        resolve(res.data)
      },
    });
  })
}
//封装多个Post请求
const morepost = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: api + url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: data,
      success: res => {
        resolve(res.data)
      },
    });
  })
}
//封装多个Put请求
const moreput = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: api + url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'PUT',
      data: data,
      success: res => {
        resolve(res.data)
      },
    });
  })
}


//封装提示
const tip=(text,icon)=>{
  wx.showToast({
    title: text,
    icon: icon,
    duration: 2000
  })
}


//封装一个弹出提示
const showSuccess=(text,url)=>{
  wx.showToast({
    title: text,
    icon: 'loading',
    duration:2000
  })
  setTimeout(function(){
    wx.redirectTo({
      url: url,
    })
  }, 2000);
}

//封装一个模拟框
const showModels=(text,url01,url02)=>{
  wx.showModal({
    title: '提示',
    content: text,
    success:function(res){
      if(res.confirm){
        console.log('调用——确定')
        wx.redirectTo({
          url: url01,
        })
      } else if (res.cancel){
        console.log('调用-取消') 
        wx.redirectTo({
          url: url02,
        })
      }
    }
  })
}

const getImageInfo=(url)=>{    //  图片缓存本地的方法
  return new Promise(function (resolve, reject) {
    wx.getImageInfo({   //  小程序获取图片信息API
      src: url,
      success: function (res) {
        resolve(res.path)
      },
      fail(err) {
        console.log(err)
      }
    })
  })
}


module.exports = {
  post,
  gets,
  tip,
  getImageInfo,
  moregets,
  morepost,
  showSuccess,
  showModels,
  moreput
}
