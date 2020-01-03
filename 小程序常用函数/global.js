const _URL = '';// 地址前缀
const _FileURL = '';// 上传文件地址
/**
 * 判断授权,并打开授权界面
 * @param type 类型 参考于一下链接
 * @param fun 授权完成之后调用的函数,(函数名称即可,不用带'()')
 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html#scope-%E5%88%97%E8%A1%A8
 * @author 熊羊羊
 * @return null
 */
function authJudge(type, fun) {
  // 判断是否授权获取位置信息
  wx.getSetting({
    success: (set_res) => {
      // 无授权信息,第一次授权
      if (set_res.authSetting[type] === undefined) {
        // 弹出授权
        wx.authorize({
          scope: type,
          success: () => {
            fun();
          },
          fail: () => {
            wx.showToast({
              title: '确保功能正常使用,请授权!',
              icon: 'none'
            })
          }
        })
      } else if (set_res.authSetting[type] === false) { // 授权失败,弹出页面打开授权
        wx.showModal({
          title: '提醒',
          content: '授权该功能,用于小程序功能使用',
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: res => authJudge(type, fun)
              })
            } else {
              wx.showToast({
                title: '确保功能正常使用,请授权!',
                icon: 'none'
              })
            }
          }
        })
      } else {
        fun();
      }
    }
  })
}


/**
 * 发送请求
 * @param url 请求地址
 * @param data 请求的参数
 * @return promise 
 */
function ajax (url, data = {}){
  wx.showLoading({
    title: '请求网络中....',
    mask: true
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: _URL,
      method: 'POST',
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.code === 0) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '网络出现问题，请重试!',
          icon: 'none',
          mask: true
        })
      }
    })
  });
}

/**
 * 上传文件
 * @param file 文件
 * @param data 多余的参数
 * @return promise 
 */
function uploadFile (file,data = {}) {
  wx.showLoading({
    title: '请求网络中....',
    mask: true
  })
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: _FileURL,
      filePath: file,
      name: 'file',
	  formData:data,
      success: res => {
        wx.hideLoading();
        let result = JSON.parse(res.data);
        //成功
        if (result.success == 1) {
          resolve(result);
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
          })
        }
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: '图片上传失败!请重试',
          icon: 'none',
          mask: true
        })
      }
    })
  });
}


export {
  authJudge,
  ajax,
  uploadFile
}