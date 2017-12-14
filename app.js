const express=require('express');
var mysql=require('mysql');
var bodyParser=require('body-Parser');
var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//连接数据库 createConnection(只能连接一次)
var db=mysql.createPool({
	host:'localhost',
	port:'3306',
	user:'root',
	password:'123456',
	database:'new'
})

//设置模板引擎为ejs
app.set('view engine','ejs');
app.use('/',express.static('public'));


//index页面
app.get('/',(req,res)=>{
	db.query('SELECT * FROM `move_data`',function(err,data){
		if(err){
			console.log(err)
		}else{
			console.log(data)
			res.render('index',{
				title:'最新电影推荐',
				movies:data

			})
		}
	})
})

//detail页面
app.get('/detail/:id',(req,res)=>{
	let id=req.params.id
	db.query(`SELECT * FROM move_data WHERE _id = ${id}`,function(err,data){
		if(err){
			console.log(err)
		}else{
			console.log(data)
			res.render('detail',{
				title:`机械战警详情页:${data[0].title}`,
				movies:data[0]
			})
		}
	})
});

//list页面
app.get('/admin/list',(req,res)=>{
	res.render('list',{title:"后台列表管理页面",
		movies:[{
			_id:1,
			title:'机械战警1',
			director:'何赛帕迪利亚',
			country:'美国',
			year:'2014'

		},
		{
			_id:2,
			title:'机械战警2',
			director:'何赛帕迪利亚',
			country:'美国',
			year:'2014'

		},
		{
			_id:3,
			title:'机械战警3',
			director:'何赛帕迪利亚',
			country:'美国',
			year:'2014'

		}]
	})
});

app.get('/admin/movie',(req,res)=>{
	res.render('movie',{title:"添加电影表单"})
});


app.post('/admin/add',(req,res)=>{
	let [_title,_director,_country,_year,_poster,_language,_flash,_sumary]=
		[req.body.title,req.body.director,req.body.country,req.body.year,
		req.body.poster,req.body.language,req.body.flash,req.body.sumary
		]
	db.query(`INSERT INTO move_data(title,director,country,year,poster,language,flash,sumary) VALUES('${_title}','${_director}','${_country}','${_year}','${_poster}','_language','${_flash}','${_sumary}')`,function(err,data){
		if(err){
			console.log(err)
		}else{
			console.log('添加成功',data);
			res.json({
				status:200,
				msg:'添加成功',
				url:'/admin/list'
			})
		}
	})
		console.log(req.body);
		console.log(req.body.title);
})

app.listen(3000,function(){
	console.log('启动')
})
