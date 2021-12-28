const express = require("express")
const ejs = require("ejs")

const session = require("express-session")
const app = express()
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testbookuser');
const schema={
    username:String,
    userpwd:String,
    status:String,
}

const bookschema={
    bookname:String,
    writer:String,
}
const mydata = mongoose.model('users',schema);
const bookdata = mongoose.model('books',bookschema);
// const kitty = new mydata( { name:'testZildjian2' });
// kitty.save()
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
app.use('/',express.static('public'))
app.get("/input",(req,res)=>{
    // res.send(req.query)
    console.log(req.query)

    if(req.query.submit1 == '登陆'){
        
        mydata.find({username:req.query.username},(err,data)=>{
            //用户存在性判断
            if(data == 0){
                console.log("yonghubucunzai")
                ejs.renderFile("public/index_bac.html",{returnval:"用户不存在"},(err,str)=>{
                    res.send(str)
                });
            }
            //用户登陆信息判断
            else{
                if(data[0]._doc.userpwd!=req.query.userpwd){
                    console.log("mimacuowu")
                    ejs.renderFile("public/index_bac.html",{returnval:"密码错误"},(err,str)=>{
                        res.send(str)
                    });
                }
                else{
                    console.log("dengluchenggong")
                    req.session.status = data[0]._doc.status
                    console.log(req.session.status)
                    ejs.renderFile("public/query.html",{returnval:"登陆成功"},(err,str)=>{
                        res.send(str)
                    });
                }
            }   
        })
    

    }

    if(req.query.submit1 == '注册'){
        //用户存在性判断
        if(req.query.username==""||req.query.userpwd==""){
            ejs.renderFile("public/reg_bac.html",{returnval:"请输入用户名或密码"},(err,str)=>{
                res.send(str)
            });
        }
        else{
            mydata.find({username:req.query.username},(err,data)=>{
                //用户注册信息判断
                if(data == 0){
                    console.log(data)
                    if(req.query.userpwd != req.query.confirmpwd){
                        ejs.renderFile("public/reg_bac.html",{returnval:"密码不一致"},(err,str)=>{
                            res.send(str)
                        });
                    }
                    else{
                        if(req.query.gmcode=='10634')
                        num = 1;
                        else
                        num = 0;
                        const kitty = new mydata( { username:req.query.username,userpwd:req.query.userpwd,status:num});
                        kitty.save()
                        ejs.renderFile("public/index_bac.html",{returnval:"注册成功"},(err,str)=>{
                        res.send(str)
                    });
                    }
                }
                else
                {
                    console.log("yonghuyicunzai");
                    ejs.renderFile("public/reg_bac.html",{returnval:"用户已存在"},(err,str)=>{
                        res.send(str)
                    });
                }
            })
            
        }
    

    }
    if(req.query.submit1 == '添加'){
        console.log("tianjia")
        if(req.query.bookname==""||req.query.writer==""){
            console.log("weishuru")
            ejs.renderFile("public/query.html",{returnval:"录入信息不能为空"},(err,str)=>{
                res.send(str)
            });
        }
        else{
            bookdata.find({bookname:req.query.bookname},(err,data)=>{
                //添加信息权限判断
                if(req.session.status == 0){
                    ejs.renderFile("public/query.html",{returnval:"没有管理员权限"},(err,str)=>{
                        res.send(str)
                    });
                }
                
                else{
                    if(data == 0){
                        console.log(data)
                        console.log("charuchenggong")
                        const book = new bookdata( { bookname:req.query.bookname,writer:req.query.writer});
                        book.save()
                        ejs.renderFile("public/query.html",{returnval:"插入成功"},(err,str)=>{
                            res.send(str)
                        });
                        
                    }
                    else
                    {
                        console.log("shumingyicunzai");
                        ejs.renderFile("public/query.html",{returnval:"书名已存在"},(err,str)=>{
                            res.send(str)
                        });
                    }
                }
                //添加信息存在性判断
                
            })
            
        }

        
    }

    if(req.query.submit1 == '删除'){
        console.log("shanchu")
        if(req.query.bookname==""){
            console.log("weishuru")
            ejs.renderFile("public/query.html",{returnval:"删除信息不能为空"},(err,str)=>{
                res.send(str)
            });
        }
        else{
            bookdata.find({bookname:req.query.bookname},(err,data)=>{
                //删除信息权限判断
                if(req.session.status == 0){
                    ejs.renderFile("public/query.html",{returnval:"没有管理员权限"},(err,str)=>{
                        res.send(str)
                    });
                }
                
                else{
                    if(data == 0){
                        console.log(data)
                        console.log("shanchushibai")

                        ejs.renderFile("public/query.html",{returnval:"书名不存在"},(err,str)=>{
                            res.send(str)
                        });
                        
                    }
                    else
                    {
                        console.log("shumingyicunzai");
                        bookdata.remove({bookname:req.query.bookname},(err)=>{
                            console.log(err)
                        });
                        ejs.renderFile("public/query.html",{returnval:"删除成功"},(err,str)=>{
                            res.send(str)
                        });
                    }
                }
                //添加信息存在性判断
                
            })
            
        }

        
    }
    if(req.query.submit1 == '查询'){
        
        bookdata.find({bookname:req.query.bookname},(err,data)=>{
            //查询信息存在性判断
            if(data == 0){
                console.log("shumingweiluru")
                ejs.renderFile("public/query_bac.html",{returnval:"书名未录入"},(err,str)=>{
                    res.send(str)
                });
            }
            else{
                console.log("chaxunchenggong")
                ejs.renderFile("public/query_bac.html",{returnval:"查询结果："+data[0]._doc.writer},(err,str)=>{
                    res.send(str)
                });
            }   
        })
    

    }
})
app.listen(10634)


