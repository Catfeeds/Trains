let config = require("/config.js");
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function(ops) {
    wx.login({
      success: function(res) {
        let user_save_infos = {};
        if (res.code) {
          //发起网络请求
          wx.request({
            url: `${config.get_session_key}`,
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },

            data: {
              code: res.code,
              client:1
            },
            success: function(res) {
              let user_save_infos = {};
              let session_key = res.data.data.session_key;
              wx.getUserInfo({
                success: function(resL) {
                  wx.request({
                    url: `${config.auth_login}`,
                    method: 'POST',
                    data: {
                      encryptedData: resL.encryptedData,
                      iv: resL.iv,
                      sessionKey: session_key,
                      client:1
                    },
                    success: function(resK) {
                      user_save_infos.openid = resK.data.data.openId;
                      user_save_infos.userid = resK.data.data.user_id;
                      user_save_infos.avatarUrl = resK.data.data.avatarUrl;
                      user_save_infos.nickName = resK.data.data.nickName;
                      user_save_infos.mobile = resK.data.data.mobile;
                      user_save_infos.session_key = session_key;
                      wx.setStorage({
                        key: 'user_save_infos',
                        data: user_save_infos,
                        success: function(res) {
                          console.log("...");
                        }
                      })
                    }
                  })
                }
              })
            },
            fail: function() {
              console.log('信息获取失败！')
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {
    // options.query.train_id
    console.log(options)
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },
  globalData: {
    userInfo: null
  }
})