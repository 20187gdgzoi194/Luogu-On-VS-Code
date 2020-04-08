const vscode = require('vscode');
const HTTPSupport = require('axios');
const Cookies = require('tough-cookie');
const MarkdownIt = require('markdown-it');
const MarkdownItKatex = require('@luogu-dev/markdown-it-katex');
const cookiessupport = require('axios-cookiejar-support').default;
const CSRF_TOKEN_REGEX = /<meta name="csrf-token" content="(.*)">/
const md=MarkdownIt();
var base64='',islogin=false;
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/82.0.4077.0 Safari/537.36 LVSC/1.3.2';//模拟浏览器UA，防止洛谷服务器不认，拒绝服务。
md.use(MarkdownItKatex);//Markdown-it-Latex无法使用
function jsonarraylength(jsonarray) {
	var jsonlen=0;
	for(var i in jsonarray){
		jsonlen++;
		console.log(i);
	}
	console.log(jsonlen);
	return jsonlen;
}
function MakeTag(array,length) {
	var str='';
	for(var i=0;i<length-1;i++){
		str+=array[i].Name+'、';
	}
	str+=array[length-1].Name;
	return str;
}
function MakeSample(array,length){
	if(length==0)return '没有样例哦！';
	var str='';
	for(var i=0;i<length;i++){
		str+=`
		<h3>Sample #${String(i+1)}</h3>
		<b>Input:</b>
		<p>${array[i][0]}</p>
		<b>Output:</b>
		<p>${array[i][1]}</p>

		`
	}
	console.log(str);
	return str;
}
const cookiejar=new Cookies.CookieJar();

function apireturn() {
	const axios=HTTPSupport.default.create({
		baseURL: 'https://www.luogu.com.cn',
		withCredentials: true,
		cookiejar
	  })
	const defaults=axios.defaults;
	if(!defaults.transformRequest){
		defaults.transformRequest = [];
	}else if(!(defaults.transformRequest instanceof Array)){
		defaults.transformRequest=[defaults.transformRequest];
	}
	defaults.transformRequest.push((data,headers)=>{
		headers['User-Agent']=UA;
		return data;
	});
	return cookiessupport(axios);
}
const APILOAD=apireturn();
async function GetCaptcha(){
	const data=await APILOAD.get('api/verify/captcha',{
		params: {
		  '_t': new Date().getTime()
		},
		responseType: 'arraybuffer',
		jar: cookiejar
	}).then(
		function returndata(MSG) {
			return MSG;
		}
	);
	console.log('data:image/png;base64,'+data.data.toString("base64"));
	base64=data.data.toString("base64");
	console.log(base64);
}
var token='',StatusBar=null;
/**
 * @param {vscode.ExtensionContext} context
 */
async function GetNowBenBen(){
	let apireturn=await APILOAD.get('/feed/all?page=1',{
		jar: cookiejar
	}).then(function(MSG){
		return MSG;
	});
	console.log(apireturn);
	let html=`
	<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>犇犇</title>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<meta name="renderer" content="webkit">
		<meta name="csrf-token" content="1586249278:GgZXfm811YSzc3XH4HTrIVeKBSLw2ash9AcUb8nPeXw=">
				<meta name="keywords" content="洛谷,洛谷Online judge,noip,noi,信息学,信息学竞赛,acm,竞赛,onlineJudge,洛谷Onlinejudge,信息学学习" />
	<meta name="description" content="洛谷创办于2013年，致力于为参加noip、noi、acm的选手提供清爽、快捷的编程体验。它拥有在线测题系统、强大的社区、在线学习功能。很多教程内容由各位oiers提供的，内容广泛。无论是初学oi的蒟蒻，还是久经沙场的神犇，均可从中获益，也可以帮助他人，共同进步。是学习noip等竞赛时理想的网站。" />
			<link rel="stylesheet" href="https://cdn.luogu.com.cn/css/amazeui.min.css"/>
		<link rel="stylesheet" href="https://cdn.luogu.com.cn/css/katex.min.css"/>
		<link rel="stylesheet" href="https://cdn.luogu.com.cn/css/luogu3.css?ver=20190102">
		<link rel="stylesheet" href="https://cdn.luogu.com.cn/css/highlight_tomorrow.css">
		<link rel="stylesheet" href="https://cdn.luogu.com.cn/markdown-palettes/markdown-palettes.css?ver=20190219">
		<script src="https://cdn.luogu.com.cn/js/jquery-2.1.1.min.js"></script>
		<script src="https://cdn.luogu.com.cn/js/luogu3_pre.js?ver=20190101"></script>
		<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" media="screen"/>
		<link rel="stylesheet" href="https://cdn.luogu.com.cn/fe/loader.css?ver=20200331-2">
		<script>window._feInjection = JSON.parse(decodeURIComponent("%7B%22code%22%3A200%2C%22currentUser%22%3A%7B%22blogAddress%22%3Anull%2C%22followingCount%22%3A0%2C%22followerCount%22%3A5%2C%22ranking%22%3A27265%2C%22unreadMessageCount%22%3A0%2C%22unreadNoticeCount%22%3A0%2C%22verified%22%3Atrue%2C%22uid%22%3A333163%2C%22name%22%3A%22chuangzhi%22%2C%22slogan%22%3A%22%22%2C%22badge%22%3Anull%2C%22isAdmin%22%3Afalse%2C%22isBanned%22%3Afalse%2C%22color%22%3A%22Blue%22%2C%22ccfLevel%22%3A0%7D%2C%22currentTemplate%22%3A%22Excited%22%2C%22currentData%22%3A%7B%22shortHeader%22%3Atrue%2C%22pageName%22%3A%22%5Cu6d1b%5Cu8c37%22%2C%22title%22%3A%22%5Cu9996%5Cu9875%22%7D%2C%22currentTheme%22%3A%7B%22id%22%3A25337%2C%22header%22%3A%7B%22imagePath%22%3A%22https%3A%5C%2F%5C%2Fi.loli.net%5C%2F2019%5C%2F08%5C%2F01%5C%2F5d42f4ae15b0082744.png%22%2C%22color%22%3A%5B%5B244%2C90%2C141%2C1%5D%5D%2C%22blur%22%3A0%2C%22brightness%22%3A0%2C%22degree%22%3A108%2C%22repeat%22%3A0%2C%22position%22%3A%5B10%2C50%5D%2C%22size%22%3A%5B-1%2C-1%5D%2C%22type%22%3A1%2C%22__CLASS_NAME%22%3A%22Luogu%5C%5CDataClass%5C%5CUser%5C%5CThemeConfig%5C%5CHeaderFooterConfig%22%7D%2C%22sideNav%22%3A%7B%22logoBackgroundColor%22%3A%5B244%2C90%2C141%2C1%5D%2C%22color%22%3A%5B244%2C90%2C141%2C1%5D%2C%22invertColor%22%3Atrue%2C%22__CLASS_NAME%22%3A%22Luogu%5C%5CDataClass%5C%5CUser%5C%5CThemeConfig%5C%5CSideNavConfig%22%7D%2C%22footer%22%3A%7B%22imagePath%22%3A%22https%3A%5C%2F%5C%2Fi.loli.net%5C%2F2019%5C%2F08%5C%2F01%5C%2F5d42f4ae15b0082744.png%22%2C%22color%22%3A%5B%5B244%2C90%2C141%2C1%5D%5D%2C%22blur%22%3A0%2C%22brightness%22%3A-41%2C%22degree%22%3A0%2C%22repeat%22%3A0%2C%22position%22%3A%5B90%2C50%5D%2C%22size%22%3A%5B-1%2C-1%5D%2C%22type%22%3A1%2C%22__CLASS_NAME%22%3A%22Luogu%5C%5CDataClass%5C%5CUser%5C%5CThemeConfig%5C%5CHeaderFooterConfig%22%7D%7D%7D"));window._feConfigVersion=1585662696;</script>
		<script>window._release = '20200331-2';</script>
		<script src="https://cdn.luogu.com.cn/fe/loader.js?ver=20200331-2" charset="utf-8" defer></script>
		<style type="text/css">
			list-style:none;
			list-style-type:none;
		</style>
	</head>
	<body>
		${apireturn.data}
	</body>
	</html>		
	`;//使用洛谷原生head标签，待解决问题：犇犇前面有很神奇的点
	console.log(html);
	const panel=vscode.window.createWebviewPanel('犇犇','犇犇',
		vscode.ViewColumn.Two,{
			enableScripts: true,
			retainContextWhenHidden: true,
			preserveFocus: true
		});
		panel.webview.html=html;
}
function activate(context) {
	console.log('ACTIVE');
	let disposable = vscode.commands.registerCommand('extension.About', function () {
		vscode.window.showInformationMessage('LVSC Version 1.3.2');//关于我们
	});
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('extension.WatchProblem', async function () {
		console.log('Watch Problem');
		const PID=await vscode.window.showInputBox({
			placeHolder: 'Input the Problem ID',
			ignoreFocusOut: true
		}).then(
			function returnPID(MSG) {
				return MSG;
			}
		);
		if(!PID){
			return;//用户没有输入
		}
		console.log('PID:'+PID);
		const json=await APILOAD.get('api/problem/detail/'+PID).then(
			function returnJSON(MSG) {
				return MSG;
			}
		);//读入题目JSON
		console.log(json.data);
		if(json.data.status==200){
			vscode.window.showInformationMessage('Get Problem Successfully!');
			const TagsArrayLength=jsonarraylength(json.data.data.Tags);
			const Tags=MakeTag(json.data.data.Tags,TagsArrayLength);//生成标签
			console.log(Tags);
			console.log(jsonarraylength(json.data.data.Sample));
			var BG='',miaoshu='';
			const sample=MakeSample(json.data.data.Sample,jsonarraylength(json.data.data.Sample));//生成样例
			if(!json.data.data.Background){ //获取题目背景
				BG='无题目背景';
			}
			else{
				BG=json.data.data.Background;
			}
			console.log(BG);
			if(!json.data.data.Description){
				miaoshu='无题目描述';//获取题目描述
			}
			else{
				miaoshu=json.data.data.Description;
			}
			var Hint='';//获取题目提示
			if(!json.data.data.Hint){
				Hint='无题目提示';
			}
			else{
				Hint=json.data.data.Hint;
			}
			console.log(sample);
			const HTML=`
			<!DOCTYPE HTML>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>${json.data.data.StringPID+':'+json.data.data.Name}</title>
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.12.0/build/styles/default.min.css">
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css">
				</head>
				<body>
					<h1>${json.data.data.StringPID+':'+json.data.data.Name}</h1>
					<hr>
					<h2>题目背景</h2>
					${md.render(BG)}
					<h2>题目描述</h2>
					${md.render(miaoshu)}
					<h2>输入格式</h2>
					${md.render(json.data.data.InputFormat)}
					<h2>输出格式</h2>
					${md.render(json.data.data.OutputFormat)}
					<h2>样例</h2>
					${sample}
					<h2>提示</h2>
					${md.render(Hint)}
					<h2>标签</h2>
					<b>${Tags}</b>
					<p>  </p>
					<b>题目来源于洛谷。<br><br><br><br>Generated By LVSC. Copyright 2019-2020 © Chuangzhi Programming Studio. All Right Reserved.</b>
				</body>	
			</html>	
			`
			console.log(HTML);//生成展示的HTML文档
			const panel=vscode.window.createWebviewPanel(json.data.data.StringPID+':'+json.data.data.Name,
			json.data.data.StringPID+':'+json.data.data.Name,vscode.ViewColumn.Two,{
				enableScripts: true,
				retainContextWhenHidden: true
			})
			panel.webview.html=HTML;//展示
		}
		else{
			vscode.window.showErrorMessage('Get Problem Failed, Error Code:'+String(json.data.status)+" Reason:"+json.data.data);
			//JSON错误，可能无权看题、没有这道题等等
		}
	});
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('extension.Login', async function () {
		const username=await vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Input your Username, Phone Number or Email'
		}).then(
			function returnusername(MSG) {
				return MSG;
			}
		);//输入用户名（也可以是手机号、邮箱）
		if(!username)return;
		const password=await vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Input your Password',
			password: true
		}).then(
			function returnusername(MSG) {
				return MSG;
			}
		);//读取密码
		if(!password)return;
		await GetCaptcha();//获得验证码图片
		console.log(base64);
		const HTML=`
			<!DOCTYPE HTML>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>Luogu Captcha</title>
				</head>
				<body>
					<div align="center">
						<img src="https://cdn.luogu.com.cn/fe/logo.png" height="81" width="160" />
					</div>
					<div align="center">
						<h2><font color=#6495ED>在洛谷，享受 Coding 的欢乐！</font></h2>
					</div>
					<div align="center">
						<img id="cap" src="data:image/png;base64,${base64}">
					</div>
					<div align="center">
						<font color=#6495ED><h4>请在上方输入框内输入验证码</h4></font>
					</div>				
				</body>
			</html>	
		`
		const panel=vscode.window.createWebviewPanel('Luogu Captcha','Luogu Captcha',
		vscode.ViewColumn.One,{
			enableScripts: true,
			retainContextWhenHidden: true,
			preserveFocus: true
		});
		panel.webview.html=HTML;
		const captcha=await vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Enter Verification Code'
		}).then(
			function returnusername(MSG) {
				return MSG;
			}
		);
		token=await APILOAD.get('',{jar: cookiejar}).then(
			function getheader(MSG){
				const returndata=CSRF_TOKEN_REGEX.exec(MSG.data);
				return returndata ? returndata[1].trim() : null
			}
		);
		console.log(cookiejar);
		console.log(token);
		const loginreturn=await APILOAD.post('/api/auth/userPassLogin',{
			username,password,captcha
		},{
			headers:{
				'X-CSRF-Token': token,
				'Referer': 'https://www.luogu.com.cn/auth/login',
			},
			jar: cookiejar
		}).then(
			function returnMSG(MSG){
				return MSG;
			}
		);
		console.log(loginreturn);
		if(loginreturn){
			vscode.window.showInformationMessage('Login Successfully!');
			if(StatusBar===null){
				StatusBar=vscode.window.createStatusBarItem();
			}
			StatusBar.text='You are logged in to Luogu';
			StatusBar.show();
			islogin=true;
		}
	});
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('extension.Fate',async function () {
		token=await APILOAD.get('',{jar: cookiejar}).then(
			function getheader(MSG){
				const returndata=CSRF_TOKEN_REGEX.exec(MSG.data);
				return returndata ? returndata[1].trim() : null
			}
		);
		const json=await APILOAD.post('/index/ajax_punch',{},{
			headers:{
				'X-CSRF-Token': token,
				'Referer': 'https://www.luogu.com.cn/'
			},
			jar: cookiejar
		}).then(
			function returnMSG(MSG){
				return MSG;
			}
		);
		console.log(json.data);
		if(json.data.code!=200){
			vscode.window.showInformationMessage(json.data.message);
			return;
		}
		else{
			vscode.window.showInformationMessage('Get Fate Successfully!');
		}
	});
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('extension.Logout',async function () {
		if(StatusBar===null){
			StatusBar=vscode.window.createStatusBarItem();
			StatusBar.text='You are logged out to Luogu';
			StatusBar.show();
			return;
		}
		if(!islogin){
			StatusBar.text='You are logged out to Luogu';
			StatusBar.show();
			return;
		}
		var uid;
		cookiejar.getCookies('https://www.luogu.com.cn',
			function returndata(err,cookie) {
				console.log(err);
				console.log(cookie);
				if(err===null){
					var data=cookie.find((cookie)=>cookie.key==='_uid');
					console.log(data);
					console.log(data.value);
					uid=data.value;
				}
			}
		);
		const logoutdata=await APILOAD.get('https://www.luogu.com.cn/api/auth/logout?uid='+String(uid),
		{
			jar: cookiejar
		}).then(
			function returnMSG(MSG) {
				return MSG;
			}
		);
		console.log(logoutdata);
		if(logoutdata.status==200){
			vscode.window.showInformationMessage('Logout Successfully!');
			StatusBar.text='You are logged out to Luogu';
			StatusBar.show();
			islogin=false;
		}
		else{
			vscode.window.showErrorMessage('Error, Error Code:'+String(logoutdata.status));
		}
	});
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('extension.PostBenBen',async function () {
		if(!islogin){
			vscode.window.showInformationMessage('Please Login First!');
			return;
		}
		let benben=await vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: '输入你的犇犇'
		}).then(
			function returnMSG(MSG){
				return MSG;
			}
		);
		console.log(benben);
		token=await APILOAD.get('',{jar: cookiejar}).then(
			function getheader(MSG){
				const returndata=CSRF_TOKEN_REGEX.exec(MSG.data);
				return returndata ? returndata[1].trim() : null
			}
		);
		benben="content="+benben;
		let postdata=await APILOAD.post('/api/feed/postBenben',benben,{
			headers:{
				'X-CSRF-Token': token,
				'Referer': 'https://www.luogu.com.cn/'
			},
			jar: cookiejar
		}).then(
			function returnMSG(MSG){
				return MSG;
			}
		);
		console.log(postdata);
		if(postdata.data.status!=200){
			vscode.window.showErrorMessage('发送失败，请检查犇犇是否为空或被禁言！');
			return;
		}else{
			vscode.window.showInformationMessage('发送成功！');
		}
		GetNowBenBen();
	});
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('extension.WatchBenBen', async function () {
		await GetNowBenBen();
	});
	context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {}
module.exports = {
	activate,
	deactivate
}
