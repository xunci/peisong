export const http = function(fn, data = {}) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: fn,
      data,
      success: res => {
        wx.hideLoading()
        console.log(`[云函数] [${fn}]成功: `, res.result)
        resolve(res.result)
      },
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [addOrUpdateOrder] 调用失败', err)
        reject(err)
      },
    })
  })
}
