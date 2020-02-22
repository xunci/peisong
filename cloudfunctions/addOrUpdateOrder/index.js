// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "peisong-test-5qvzg",//这个就是环境id
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("event ", event)
  const _ = db.command
  var _err = ""
  var _status = ""

  if ( event.order== null ) {
    _err = "order is null"
    _status = "fail"
    return {
      err: _err,
      status: _status
    }
  }

  var isDispatcher = false

  await db.collection('dispatcher')
    .where({
      openid: _.eq(wxContext.OPENID)
    })
    .get()
    .then(res => {
      res_log = res
      isDispatcher = (res.data.length != 0)
    })

  if (!isDispatcher && event.order.status != "orderd") {
    _err = "the order is not editable"
    _status = "fail"
    return {
      err: _err,
      status: _status
    }
  }
  
  var _isExist = false 

  await db.collection("order")
  .where({
    _id: event.order._id
  })
  .count()
  .then( res => {
    console.log("order cnt ", res)
  })


  var id = event.order._id
  delete event.order._id
  if (!_isExist) {
    await db.collection("order").add({
      data:event.order
    })
    .then(res => {
      console.log("order add ", res)
    })
  } else {
    console.log("event.order before update ", event.order)
    await db.collection("order")
    .where({
      _id: id
    })
    .update({
      data : event.order,
    })
    .then(res => {
      console.log("order update ", res)
    })
  }

  return {
    status:_status,
    err:_err
  }
}