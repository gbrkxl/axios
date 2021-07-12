let express = require('express')
let app = express()
//解决urlencoded编码
app.use(express.urlencoded({extended:true}))
//暴露静态资源
app.use(express.static(__dirname+'/ajax'))



app.get('/ajax_get',function(req,res){
    res.setHeader('Access-Control-Allow-Origin','*')
    res.send('get请求收到')
    // let authCode = Math.floor(Math.random()*8999+1000);
    // setTimeout(()=>{
        // res.send(authCode + "") 
    // },3000)
})
app.get('/jsonp_get',function(req,res){
    let {callback} = req.query
    let arr = [1,3,5,7,9]
    // console.log(JSON.stringify(arr))
    res.send(`${callback}(${JSON.stringify(arr)})`)
})
app.post('/ajax_post',function(req,res){
    res.setHeader('Access-Control-Allow-Origin','*')
    // console.log(req.body)
    let authCode = Math.floor(Math.random()*8999+1000);
    // console.log(typeof authCode)
    // setTimeout(()=>{
    //     res.send(authCode + "")
    // },3000)
    res.send(authCode + "")
})

app.listen(3000,function(err){
    if(err) console.log(err)
    else console.log('ok')
})