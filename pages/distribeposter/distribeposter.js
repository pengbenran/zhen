// pages/postersharing/postersharing.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bcg: apimg + '/image/descirbebcg.jpg',
    isOk: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '正在生成海报',
      icon: 'loading '
    })
    console.log(options.distribeId)
    // var isAgent = wx.getStorageSync('isAgent')
    wx.request({
      url: 'https://www.guqinet.com:8444/upload/getShare',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        page: 'pages/index/index',
        scene: options.distribeId
      },
      success: function (res) {
        var erweimaImg = res.data;
        that.setData({
          erweimaImg: erweimaImg.split('/').pop()
        })
        wx.getUserInfo({    //获取微信用户信息
          success: function (res) {
            let useravator = res.userInfo.avatarUrl;  //  调取图片处理方法
            that.setData({
              userName: res.userInfo.nickName
            });
            let result1 = that.getImageInfo(useravator)
            let result2 = that.getImageInfo(that.data.bcg)
            let result3 = that.getImageInfo(erweimaImg)
            Promise.all([result1, result2, result3]).then(function (res) {
              let locaImgarr = res;
              console.log(res)
              wx.getSystemInfo({
                success: function (res) {
                  that.setData({
                    screenWidth: res.screenWidth,
                  })
                  let price = '￥' + options.goodprice
                  that.drawcanvas(locaImgarr, res.screenWidth, res.screenHeight, price, function (res) {
                    if (res == "绘图完成") {
                      wx.showToast({
                        title: '海报生成成功',
                      })
                      that.setData({
                        isOk: true
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
  getImageInfo(url) {    //  图片缓存本地的方法
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
  drawcanvas: function (ImgArr, screenWidth, screenHeight, price, callback) {
    var that = this;
    const ctx = wx.createCanvasContext('firstCanvas');
    ctx.clearRect(0, 0, 0, 0);
    const WIDTH = screenWidth;
    const HEIGHT = screenWidth*1.636;
    //  绘制图片模板的 底图
    ctx.drawImage(ImgArr[1], 0, 0, WIDTH, HEIGHT);
    //ctx.drawImage(ImgArr[1], 40, 70, screenWidth - 95, screenWidth - 95);
    // ctx.setTextAlign('left')
    // ctx.setFontSize(16);
    // ctx.setFillStyle('rgb(34,34,34)')
    // ctx.fillText(`${that.data.userName}邀你加入会员`, 120, 160);

    //ctx.drawImage(ImgArr[1], 40, 70, screenWidth - 95, screenWidth - 95);
    // ctx.setTextAlign('left')
    // ctx.setFontSize(16);
    ctx.setFillStyle('rgb(34,34,34)')
    // ctx.fillText(, 120, 160);

    const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
    let [contentLeng, contentArray, contentRows] = that.textByteLength(`${that.data.userName}邀你加入会员`, CONTENT_ROW_LENGTH);
    ctx.setTextAlign('left')
    ctx.setFontSize(20);
    let contentHh = 20 * 1.3;
    for (let m = 0; m < contentArray.length; m++) {
      ctx.fillText(contentArray[m], 100, 160 + contentHh * m);
    }
    
    ctx.drawImage(ImgArr[2], screenWidth/2-75, 230, 150, 150);
    const avatarurl_width = 70;    //绘制的头像宽度
    const avatarurl_heigth = 70;   //绘制的头像高度
    const avatarurl_x = screenWidth/2-35;   //绘制的头像在画布上的位置
    const avatarurl_y = 60;   //绘制的头像在画布上的位置
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
  saveImg: function () {
    var that = this;
    wx.showToast({
      title: '正在保存',
      icon: 'loading',
      duration: 1000
    })
    wx.getSystemInfo({
      success: function (res) {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: res.screenWidth,
          height: res.screenWidth*1.636,
          destWidth: (res.screenWidth) * 4,
          destHeight: res.screenWidth * 1.636 * 4,
          canvasId: 'firstCanvas',
          fileType: 'jpg',
          success: function (res) {
            var templocaFilePate = res.tempFilePath
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.delImg(templocaFilePate, that.data.erweimaImg)
                    }
                  });
                }
                else {
                  that.delImg(templocaFilePate, that.data.erweimaImg)
                }
              },
            })
          }
        })
      }
    })
  },
  delImg: function (templocaFilePate, Imgfilepath) {
    var that = this;
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
          data: {
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