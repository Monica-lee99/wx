// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  var data = { price: event.price, title: event.title ,sum:event.sum }
  try {
    return await db.collection("addtocart")
      .add({
        data: data
      }).then(res => { console.log(res) })
      .catch(err => { console.log(err) })
  } catch (e) {
    console.log(e)
  }
}