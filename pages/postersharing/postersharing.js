// pages/postersharing/postersharing.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   bcg:apimg+'/image/bcg.jpg',
   isOk:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
 onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '正在生成海报',
      icon:'loading '
    })
   var distribeId = wx.getStorageSync('distribeId')
    wx.request({
      url: 'https://www.guqinet.com:8444/upload/getShare',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        page: 'pages/group/group',
        scene: options.goodid + '&' + distribeId
      },
      success: function (res) {
        var erweimaImg = res.data;
        that.setData({
          erweimaImg:erweimaImg.split('/').pop()
        })
        wx.getUserInfo({    //获取微信用户信息
          success: function (res) {
            let useravator=res.userInfo.avatarUrl;  //  调取图片处理方法
            that.setData({
              userName: res.userInfo.nickName
            });
            let result1 = that.getImageInfo(useravator)
            let result2 = that.getImageInfo(options.goodimg)
            let result3 = that.getImageInfo(erweimaImg)
            Promise.all([result1, result2, result3]).then(function (res) {
              let locaImgarr = res;
              wx.getSystemInfo({
                success: function (res) {
                  that.setData({
                    screenWidth: res.screenWidth - 20,
                    screenHeight: res.screenHeight - 100
                  })
                  let price='￥'+options.goodprice
                  that.drawcanvas(locaImgarr, res.screenWidth, res.screenHeight, price,options.goodname,function(res){
                    if(res=="绘图完成"){
                      wx.showToast({
                        title: '海报生成成功',
                      })
                      that.setData({
                        isOk:true
                      })
                    }
                  })
                },
              })

            })
          }
        });  
      }
    })
  },
  textByteLength(text, num) {  // text为传入的文本  num为单行显示的字节长度
    let strLength = 0; // text byte length
    let rows = 1;
    let str = 0;
    let arr = [];
    for (let j = 0; j < text.length; j++) {
      if (text.charCodeAt(j) > 3) {
        strLength += 2;
        if (strLength > rows * num) {
          strLength++;
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      } else {
        strLength++;
        if (strLength > rows * num) {
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      }
    }
    arr.push(text.slice(str, text.length));
    return [strLength, arr, rows]   //  [处理文字的总字节长度，每行显示内容的数组，行数]
  },
  getImageInfo(url) {    //  图片缓存本地的方法
    return new Promise(function(resolve, reject) {  
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
},
  drawcanvas: function (ImgArr, screenWidth, screenHeight, price,title,callback){
    var that=this;
    const ctx = wx.createCanvasContext('firstCanvas');
    ctx.clearRect(0, 0, 0, 0);
    const WIDTH = screenWidth;
    const HEIGHT =screenHeight;
    //  绘制图片模板的 底图
    //ctx.drawImage(ImgArr[0], 20, 20, WIDTH-40, HEIGHT-40);
    ctx.setFillStyle('rgb(255,255,255)')
    ctx.fillRect(0, 0, WIDTH, 500)
    ctx.drawImage(ImgArr[1], 40, 70, screenWidth - 95, screenWidth - 95);
    // ctx.setTextAlign('left')
    // ctx.setFontSize(16);
    ctx.setFillStyle('rgba(34,34,34,.64)')
    // ctx.fillText(`${that.data.userName}给您分享了一件商品`, 80, 40);


    const CONTENT_ROW_LENGTH1 = 30;  // 正文 单行显示字符长度
    let [contentLeng1, contentArray1, contentRows1] = that.textByteLength(`${that.data.userName}给您分享了一件商品`, CONTENT_ROW_LENGTH1);
    ctx.setTextAlign('left')
    ctx.setFontSize(20);
    let contentHh1 = 20 * 1.3;
    for (let n = 0; n < contentArray1.length; n++) {
      ctx.fillText(contentArray1[n], 80, 35 + contentHh1 * n);
    }
    // ctx.setTextAlign('left')
    // ctx.setFontSize(16);
    // ctx.setFillStyle('rgba(34,34,34,.64)')
    // ctx.fillText(title, 40, 375);
    const CONTENT_ROW_LENGTH = 30;  // 正文 单行显示字符长度
    let [contentLeng, contentArray, contentRows] = this.textByteLength(title, CONTENT_ROW_LENGTH);
    ctx.setTextAlign('left')
    ctx.setFontSize(20);
    let contentHh = 20 * 1.3;
    for (let m = 0; m < contentArray.length; m++) {
      ctx.fillText(contentArray[m], 40, 375 + contentHh * m);
    }
    ctx.setTextAlign('left')
    ctx.setFontSize(16);
    ctx.setFillStyle('rgba(34,34,34,.64)')
    ctx.fillText('长按识别小程序码', 40, 450);
    ctx.setTextAlign('left')
    ctx.setFontSize(20);
    ctx.setFillStyle('rgb(235, 57, 65)')
    ctx.fillText(price, 40, 430);
    ctx.drawImage(ImgArr[2], 230, 370, 100, 100);
    const avatarurl_width = 50;    //绘制的头像宽度
    const avatarurl_heigth = 50;   //绘制的头像高度
    const avatarurl_x = 20;   //绘制的头像在画布上的位置
    const avatarurl_y = 10;   //绘制的头像在画布上的位置
    ctx.save();
    ctx.beginPath(); //开始绘制
    ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(ImgArr[0], avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); // 推进去图片，必须是https图片
    ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制
    ctx.draw(); 
    callback("绘图完成")
  },
  saveImg:function(){
    var that = this;
    wx.showToast({
      title: '正在保存',
      icon:'loading',
      duration:1000
    })
    wx.getSystemInfo({
      
      success: function(res) {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width:res.screenWidth,
          height:500,
          destWidth: (res.screenWidth)*4,
          destHeight: 500*4,
          canvasId: 'firstCanvas',
          fileType: 'jpg',
          success: function (res) {
            var templocaFilePate = res.tempFilePath
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                     success(){
                       that.delImg(templocaFilePate, that.data.erweimaImg)
                     }
                  });        
                }
                else{
                  that.delImg(templocaFilePate, that.data.erweimaImg)
                }
            },
          }) 
      }
  })
  }
    })
  },
  delImg: function (templocaFilePate,Imgfilepath){
    var that=this;
    wx.saveImageToPhotosAlbum({
      filePath: templocaFilePate,
      success(res) {
        wx.showToast({
          title: '图片保存成功',
          icon: 'success',
          duration: 1000
        })
        wx.request({
          url: 'https://www.guqinet.com:8444/upload/delFile',
          headers: {
            'Content-Type': 'application/json'
          },
          data:{
            path: Imgfilepath
          },
          success: function (res) {
              console.log(res)
          }
        })
      }
    })
    
  }
})