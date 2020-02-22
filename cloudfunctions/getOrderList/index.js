// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "peisong-test-5qvzg",//这个就是环境id
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.command

  var list = ""
  var _err = ""
  var querry  = {}

  console.log("mjh test event ", event)
  console.log("mjh test ctx ", context)

  if (event.order_type == "history_order") {
    console.log("history order")
    querry = {
      "orderer": wxContext.OPENID
    }
  } else if (event.order_type == "shopping_order") {
    querry = {
      status:"orderd"
    }
  } else if (event.order_type == "dispatching_order") {
    querry = {
      status:"purchased"
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

  console.log("isDispatcher ", isDispatcher)
  console.log("order_tyoe", event.order_type)
  if (!isDispatcher && event.order_type != "history_order") {
    _err = "access error"

    return {
      err: _err
    }
  }
  console.log("querry ", querry)
  var _list
  await db.collection('order')
    .where(
      querry
    )
    .get()
    .then(res => {
      _list = res.data
    })

  return {
    list: _list,
    err: _err
  }
}