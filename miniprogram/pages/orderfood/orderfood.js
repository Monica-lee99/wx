// pages/orderfood/orderfood.js
import Toast from 'vant-weapp/toast/toast';


// <van-toast id="van-toast" />
Page({
  data: {
    active: 0,
    desc:[],
    count:[],
    buy:[],
    sum:0,
    // Toast:({})
  },
  switchNav: function (e) {
    var id = e.target.id;
    this.setData({
      active: id
    });
    this.load()
  },
  load:function(){
    var that=this;
    wx.cloud.callFunction({
      name: "orderfood",
      success: (res) =>{
        var desc = res.result.data[0].desc[that.data.active];
        that.setData({ desc: desc });
        var a=[];
        for(var i=0;i<that.data.desc.length;i++){
          a[i]=0;
        }
        that.setData({
          count:a
        })
      }
    })
    
  },
  add:function(e){
    var index=e.target.id;
    var count1=this.data.count[index]+1;
    this.data.count.splice(index,1,count1);
    this.setData({count:this.data.count});
    if(this.data.buy.length==0){
      this.data.buy.splice(0,0,this.data.desc[index]);
      this.data.buy[0].sum=1;
      // console.log(this.data.buy)
    }else{
      var that = this;
      var newArr = that.data.buy.filter(function (obj) {
        return obj.title == that.data.desc[index].title;
      });
      if(newArr.length==0){
        this.data.buy.unshift(this.data.desc[index]);
        this.data.buy[0].sum = 1;
        this.data.buy[0].price = this.data.desc[index].price * this.data.desc[index].sum
        // console.log(this.data.buy)
      }else{
        for(var i=0;i<this.data.buy.length;i++){
          if(this.data.buy[i]==newArr[0]){
            this.data.buy[i].sum += 1;
          }
        }
        
      }
    }
    for (var i = 0,sum=0; i < this.data.buy.length; i++){
      sum+=this.data.buy[i].price*this.data.buy[i].sum;
    }
    this.setData({sum:sum})
    
    
  },
  sub:function(e){
    var index=e.target.id;
    if(this.data.count[index]>0){
      var count1=this.data.count[index]-1;
      this.data.count.splice(index,1,count1);
      this.setData({count:this.data.count});
      var that = this;
      var newArr = that.data.buy.filter(function (obj) {
        return obj.title == that.data.desc[index].title;
      });
      if(newArr.length!=0){
        for (var i = 0; i < this.data.buy.length; i++) {
          if (this.data.buy[i] == newArr[0]) {
            this.data.buy[i].sum -= 1;
            this.data.sum -= this.data.buy[i].price ;
          }
        }
        this.setData({sum:this.data.sum})
      }
    }
  },
  pay:function(){
    if(this.data.sum==0){ 
      Toast("选择商品为空")
    }else{
      for(var i=0;i<this.data.buy.length;i++){
        wx.cloud.callFunction({
          name:"AddToCart",
          data:{price:`${this.data.buy[i].price}`,title:`${this.data.buy[i].title}`,sum:`${this.data.buy[i].sum}`}
        }).then(res=>{
          wx.navigateTo({
            url: '/pages/pay/pay',
          })
        })
        .catch(err=>{console.log(err)})
      }
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.load();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})