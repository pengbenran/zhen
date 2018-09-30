var api = getApp().globalData.api;

//封装一个POST请求
const  post=(url,data)=>{
  return new Promise((resolve, reject) => {
    wx.request({
      url: api + url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method:'post',
      data: {
        params: data
      },
      success: res => {
        if (res.data.code == 0) {
          resolve(res.data)
          console.log(res.data.data)
        } else {
          reject(res.data)
          console.log('请求失败')
        }
      },
    });
  })
}

//封装一个get请求
const gets = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url:api+url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'get',
      data: {
        params: data
      },
      success: res => {
        if (res.data.code == 0) {
          resolve(res.data)
          console.log(res.data.data)
        } else {
          reject(res.data)
          console.log('请求失败')
        }
      },
    });
  })
}

//封装单个get请求
const onegets = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: api + url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'get',
      data: {
        memberId: data
      },
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



//封装一个弹出提示
const showSuccess=(text,url)=>{
  wx.showToast({
    title: text,
    icon: 'loading',
    duration:2000
  })
  setTimeout(function(){
    wx.navigateTo({
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
        wx.navigateTo({
          url: url01,
        })
      } else if (res.cancel){
        console.log('调用-取消') 
        wx.navigateTo({
          url: url02,
        })
      }
    }
  })
}



module.exports = {
  post,
  gets,
  onegets,
  moregets,
  showSuccess,
  showModels
}
