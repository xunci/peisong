// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "peisong-test-5qvzg",//这个就是环境id
  traceUser: true,
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const _ = db.commond
  var isDispatcher = false
  await db.collection('dispatcher').where({
    appid: wxContext.APPID
  })
  .get({
    success: function (res) {
      console.log(res)
    }
  }) 

  return {
    dispatcher: isDispatcher,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}