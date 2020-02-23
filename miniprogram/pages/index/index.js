import { http } from '../../request'
//index.js
const app = getApp()
const goodsItem = {
  name: '',
  number: '',
  note: '',
  status: 'in_stock', //枚举： 已下单、已购买、无法购买
  handler: '',
  hand_time: '',
}
Page({
  data: {
    formData: { orderer: '', phone_number: '' },
    goods: [{ ...goodsItem }],
    action: 'add',
    orderId: null,

    authorized: null,
  },

  onLoad() {
    const that = this
    wx.hideTabBar()
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                authorized: true,
              })
              that.login(res.userInfo)
            },
          })
        } else {
          that.setData({
            authorized: false,
          })
        }
      },
    })
  },

  getUserInfo(data) {
    console.log('授权信息', data)
    this.setData({
      authorized: true,
    })
    this.login(data.detail.userInfo || null)
  },

  onShow() {
    const { action, currentOrder } = app
    if (action) {
      this.setData({
        action,
        goods: currentOrder.goods,
        orderId: currentOrder._id,
        formData: {
          orderer: currentOrder.orderer,
          phone_number: currentOrder.phone_number,
        },
      })
    }

    app.action = null
    app.currentOrder = null
  },

  async login(userInfo) {
    const { dispatcher } = await http('login', { userInfo })
    // const dispatcher = false
    app.isDispatcher = dispatcher
    if (dispatcher) {
      wx.hideTabBar()
      wx.switchTab({
        url: `/pages/order/index`,
      })
    } else {
      wx.showTabBar()
    }
  },

  async submitForm() {
    const { formData, goods, action, orderId } = this.data
    const goodsSubmit = goods.filter(item => item.name && item.number)
    if (!formData.orderer.trim()) {
      return wx.showToast({
        title: '请填写姓名',
        icon: 'none',
      })
    }
    if (!formData.phone_number.trim()) {
      return wx.showToast({
        title: '请填写电话',
        icon: 'none',
      })
    }
    if (!goodsSubmit.length) {
      return wx.showToast({
        title: '请添加货物',
        icon: 'none',
      })
    }
    const order = {
      _id: action === 'update' ? orderId : '',
      ...formData,
      goods: goodsSubmit,
      hand_time: '',
      handler: '',
      status: 'orderd', // 已下单、正在采购、已购买、已配送、完成
    }

    const { err } = await http('addOrUpdateOrder', { order })
    if (err) {
      wx.showToast({
        title: err,
        icon: 'none',
      })
    } else {
      wx.showToast({
        title: '添加成功',
      })
      wx.switchTab({
        url: `/pages/order/index`,
      })
    }
  },

  addItem() {
    const index = this.data.goods.length
    this.setData({
      [`goods[${index}]`]: { ...goodsItem },
    })
  },

  delItem(e) {
    const { goods } = this.data
    const { index } = e.currentTarget.dataset
    goods.splice(index, 1)
    this.setData({
      goods: goods,
    })
  },

  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value,
    })
  },

  goodsNameChange(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      [`goods[${index}].name`]: e.detail.value,
    })
  },

  goodsCountChange(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      [`goods[${index}].number`]: e.detail.value,
    })
  },

  onGetOpenid() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getOrderList',
      data: {
        order_type: 'history_order',
      },
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      },
    })
  },
})
