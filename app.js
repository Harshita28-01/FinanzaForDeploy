require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const mongoose=require("mongoose");
const path=require("path");
const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGODB);
// console.log(process.env.MONGODB);
//Bank detail Schema
const depositSchema=new mongoose.Schema({
  username: String,
  acNo:String,
  certiNo:String,
  acHolder:String,
  custId:String,
  jointAcHolder:String,
  jointCustId:String,
  bankNameAdd:String,
  amount:String,
  DOI:Date,
  DOM:Date,
  ROI:String,
  typeAc:String,
  nominee:String
});

//Users login Schema
const userSchema=new mongoose.Schema({
  username: String,
  password: String
});

const Deposit=mongoose.model("Deposit",depositSchema);

const Login=mongoose.model("Login",userSchema);

const PORT=process.env.PORT || 3001;
//for viewing data
app.get("/stored-data",function(req,res){
  Deposit.find({},function(err,result){
    if(!err){
      // console.log(result);
      res.json(result);
    }
  }).sort({DOM:'asc'});
});

//for adding record of bank details
app.post("/api",function(req,res){
  const fullBankDetail=new Deposit({
    username:req.body.username,
    acNo:req.body.acNo ,
    certiNo:req.body.certiNo ,
    acHolder:req.body.acHolder ,
    custId:req.body.custId,
    jointAcHolder:req.body.jointAcHolder,
    jointCustId:req.body.jointCustId,
    bankNameAdd: req.body.bankNameAdd,
    amount:req.body.amount,
    DOI:req.body.DOI,
    DOM:req.body.DOM,
    ROI:req.body.ROI,
    typeAc:req.body.typeAc,
    nominee:req.body.nominee
  });
  Deposit.find({username:fullBankDetail.username,acNo:fullBankDetail.acNo},function(err,result){
    if(!err){
      if(result.length===0){
        fullBankDetail.save();
        res.json({data:1});
      }
      else{
        res.json({data:0});
      }
    }
  })
  

});

//for monitoring sign up request
app.post("/signUp",function(req,res){
  // console.log(req.body.username);
  // console.log(req.body.password);

  const user=new Login({
    username:req.body.username,
    password:req.body.password
  });
  console.log(username+" "+password);
  Login.find({username:user.username},function(err,result){
    if(!err){
      if(result.length===0){
        user.save();
        res.json({data:1});
      }
      else{
        res.json({data:0});
      }
    }
  });
  

});

app.post(`/fin/login`,function(req,res){
  let username1=req.body.username;
  let password1=req.body.password;
  console.log(username1,password1);
  Login.find({username:username1,password:password1},function(err,result){
    if(!err){
      if(result.length===0){
        res.json({data:0});
      }
      else{
        res.json({data:1});
      }
    }else{
      res.send(err);
    }
  });
});

app.post("/delete",function(req,res){
  let username1=req.body.username;
  let acNo1=req.body.acNo;
  let certiNo1=req.body.certiNo;
  console.log(acNo1);
  Deposit.deleteMany({username:username1,acNo:acNo1,certiNo:certiNo1},function(err){
    if(!err){
      console.log(err);
    }
  });
  res.send("Deleted");
})

app.post("/edit",function(req,res){
  const fullBankDetail=new Deposit({
    username:req.body.username,
    acNo:req.body.acNo ,
    certiNo:req.body.certiNo ,
    acHolder:req.body.acHolder ,
    custId:req.body.custId,
    jointAcHolder:req.body.jointAcHolder,
    jointCustId:req.body.jointCustId,
    bankNameAdd: req.body.bankNameAdd,
    amount:req.body.amount,
    DOI:req.body.DOI,
    DOM:req.body.DOM,
    ROI:req.body.ROI,
    typeAc:req.body.typeAc,
    nominee:req.body.nominee
  });
  Deposit.findOneAndUpdate({username:fullBankDetail,acNo:fullBankDetail.acNo,certiNo:fullBankDetail.certiNo},{
    acHolder:req.body.acHolder ,
    custId:req.body.custId,
    jointAcHolder:req.body.jointAcHolder,
    jointCustId:req.body.jointCustId,
    bankNameAdd: req.body.bankNameAdd,
    amount:req.body.amount,
    DOI:req.body.DOI,
    DOM:req.body.DOM,
    ROI:req.body.ROI,
    typeAc:req.body.typeAc,
    nominee:req.body.nominee
  },function(err){
    if(!err){
      console.log("updated");
      res.send("updated");
    }else{
      res.send(err);
    }
  });
});

// app.use(express.static(path.join(__dirname,"/client/build")));

// app.get('/',(req,res)=>{
//   res.sendFile(path.join(__dirname,"/client/build/index.html"));
// })

// app.get("/",function(req,res){
//   res.send("Hello");
// });



if(process.env.NODE_ENV=="production"){
  app.get(`/`,(req,res)=>{
    app.use(express.static(path.join(__dirname,"/client/build")));
    res.sendFile(path.join(__dirname,"client","build","index.html"));
  })
  app.get("/add",(req,res)=>{
    app.use(express.static(path.join(__dirname,"/client/build")));
    res.sendFile(path.join(__dirname,"client","build","index.html"));
  })
  app.get("/view",(req,res)=>{
    app.use(express.static(path.join(__dirname,"/client/build")));
    res.sendFile(path.join(__dirname,"client","build","index.html"));
  })
  app.get("/sign-up",(req,res)=>{
    app.use(express.static(path.join(__dirname,"/client/build")));
    res.sendFile(path.join(__dirname,"client","build","index.html"));
  })
  app.get("/login",(req,res)=>{
    // console.log(req);
    app.use(express.static(path.join(__dirname,"/client/build")));
    res.sendFile(path.join(__dirname,"client","build","index.html"));
    // console.log(path.join(__dirname,"client","build","index.html"));
  })
  app.get("/logout",(req,res)=>{
    app.use(express.static(path.join(__dirname,"/client/build")));
    res.sendFile(path.join(__dirname,"client","build","index.html"));
  })
  app.get("/delete",(req,res)=>{
    app.use(express.static(path.join(__dirname,"/client/build")));
    res.sendFile(path.join(__dirname,"client","build","index.html"));
  })
  app.get("/edit",(req,res)=>{
    app.use(express.static(path.join(__dirname,"/client/build")));
    res.sendFile(path.join(__dirname,"client","build","index.html"));
  })
}
else{
  app.get("/",function(req,res){
    res.send("Hello");
  });
}


app.listen(PORT,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("Server working in 3001");
});

// module.exports = app;