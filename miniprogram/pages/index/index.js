//index.js
const app = getApp()

Page({
  data: {
    formData: {},
    goods:[
      {name:'ssdsd',count:1},
    ],
  },

  onLoad() {},

  submitForm() {
    console.log('this.data.formData', this.data)
  },

  addItem() {
    const item = {name:'',count:1}
    const index = this.data.goods.length
    this.setData({
      [`goods[${index}]`]: item,
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
      [`goods[${index}].count`]: e.detail.value,
    })
  },
})
