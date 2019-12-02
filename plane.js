window.onload = function () {
	var con = document.getElementsByClassName("con")[0];
	var plane = document.getElementsByClassName("plane")[0];
	var startBtn = document.getElementsByClassName("start-btn")[0];
	//全局分数
	var grade = 0;
	//全局鼠标位置变量
	var mousePageX;
	var mousePageY;
	//全局飞机位置
	var planePageX = 900;
	var planePageY = 800;
	// 全局的子弹数组，里面的内容为生成的DOM对象
	var Bullets = [];
	var Monster = [];
	var Booms = [];
	gameLoad();
	//游戏初始化
	function gameLoad() {
		//绑定开始事件
		//初始化游戏区域
		//修改con的高度和宽度
		con.style.height = window.innerHeight+"px";
		con.style.width = window.innerWidth+"px";
		startBtn.addEventListener("click", function () {
			con.removeChild(this);
			//开始游戏
			//获取鼠标的位置 
			startGame();
		})
	}
	//游戏开始 点击开始按钮
	function startGame() {
		setup();
		// 游戏区域的鼠标进入和时间
		// 鼠标进入飞机的位置立即到鼠标中心
		// con.addEventListener("mouseenter", function (e) {
		// 	plane.style.left = (e.pageX - 50) + "px";
		// 	plane.style.top = (e.pageY - 50) + "px";
		// })
		// 飞机移动事件 鼠标操作飞机
		con.addEventListener("mousemove",mousemoveByPlane);
		//键盘操作飞机
		// document.addEventListener("keydown",keymoveByPlane);

		//键盘操作飞机事件
		function keymoveByPlane(e){
			switch(e.keyCode){
				case 68:
				plane.style.left = (parseInt(plane.style.left)+20) + "px";
				break;
				case 83:
				plane.style.top = (parseInt(plane.style.top)+20) + "px";
				break;
				case 87:
				plane.style.top = (parseInt(plane.style.top)-20) + "px";
				break;
				case 65:
				plane.style.left = (parseInt(plane.style.left)-20) + "px";
				break;
			}
			planePageX = parseInt(plane.style.left);
			planePageY = parseInt(plane.style.top);
		}
		//con中鼠标移动 飞机跟随移动函数
		function mousemoveByPlane(e){
			mousePageX = e.pageX;
			mousePageY = e.pageY;
			console.log(plane);
			plane.style.left = (e.pageX - 50) + "px";
			plane.style.top = (e.pageY - 50) + "px";
		}
		//每0.1秒运行一下 调用moveBullets()函数 并传值全局子弹函数
		//子弹移动
		var intervalByBullets = setInterval(function () {
			moveBullets(Bullets, Monster);
		}, 60)
		// 创建子弹
		var createB = setInterval(function () {
			createBullets();
			// createBulletsBykey();
		}, 60)
		//怪物移动
		var intervalByMonster = setInterval(function () {
			moveMonster(Monster);
		}, 70)
		//创建怪物 打开
		var createM = setInterval(function () {
			createMonster();
		}, 960)
		//鼠标点击 生成新的子弹
		// plane.addEventListener("click",function(){
		// 	createBullets();
		// })
		//创建子弹 根据鼠标位置
		function createBullets() {
			//生成的临时子弹
			var temBullet = document.createElement("div");
			//附子弹样式的类名
			temBullet.classList.add("bullet");
			// 设定和飞机之间的距离
			temBullet.style.top = (mousePageY - 70) + "px";
			temBullet.style.left = (mousePageX - 7) + "px";
			// 将生成的子弹加入到游戏内容元素中
			con.appendChild(temBullet);
			// 加入到全局字段数组中 方面后面移动子弹和清除无用的子弹
			Bullets.push(temBullet);
		}
		//创建子弹 根据键盘位置
		function createBulletsBykey(){
				//生成的临时子弹
				var temBullet = document.createElement("div");
				//附子弹样式的类名
				temBullet.classList.add("bullet");
				// 设定和飞机之间的距离
				temBullet.style.top = (planePageY-20) + "px";
				temBullet.style.left = (planePageX +44) + "px";
				// 将生成的子弹加入到游戏内容元素中
				con.appendChild(temBullet);
				// 加入到全局字段数组中 方面后面移动子弹和清除无用的子弹
				Bullets.push(temBullet);
		}
		//子弹移动
		//子弹没有打到怪物 到边界处 消除
		//子弹打到怪物 子弹和怪物  一起消除
		function moveBullets(movetemB, movetemM) {
			// 循环子弹数组
			for (var index = 0; index < movetemB.length; index++) {
				//子弹没有打到怪物情况  消失
				if (parseInt(movetemB[index].style.top) <= 50) {
					removeBullet(index);
					continue;
				}
				//移动子弹
				movetemB[index].style.top = (parseInt(movetemB[index].style.top) - 80) + "px";
				//子弹打到怪物 子弹和怪物同时消失
				// 循环怪物数组
				//判断怪物和子弹的top值和left值 相聚不大则执行消除子弹和怪物函数
				for (var i = 0; i < movetemM.length; i++) {
					if (((parseInt(movetemB[index].style.top)) - parseInt(movetemM[i].style.top)) < 40) {
						if (Math.abs(parseInt(movetemB[index].style.left) - parseInt(movetemM[i].style.left)) < 70) {
							//发送子弹的top值和left值
							Boom(parseInt(movetemM[i].style.left),parseInt(movetemM[i].style.top));
							removeBullet(index);
							removeMonster(i);
							updateGrade(++grade);
							break;
						}
					}
				}
			}
		}

		//创建爆炸效果
		function Boom(left,top){
			//根据这个高度和宽度创建元素
			var temBoom = document.createElement("div");
			temBoom.classList.add("boom");
			temBoom.style.top = top + "px";
			temBoom.style.left = left + "px";
			con.appendChild(temBoom);
			Booms.push(temBoom);
		}

		//消除boom元素 哈哈哈
		var removeBoom = setInterval(function(){
			if(Booms.length > 0){
				con.removeChild(Booms[0]);
			Booms.shift();
			}
			
		},350)
		//调整分数
		function updateGrade(grade) {
			document.getElementsByClassName("grade")[0].innerHTML = "分数:  " + grade;
		}
		//消除子弹
		//更新子弹全局数组
		function removeBullet(index) {
			con.removeChild(Bullets[index]);
			Bullets.splice(index, 1);
		}
		//消除怪物 
		//更新怪物全局数组
		function removeMonster(index) {
			con.removeChild(Monster[index]);
			Monster.splice(index, 1);
		}
		//生成怪物
		function createMonster() {
			//生成怪物元素
			var temMon = document.createElement("div");
			temMon.classList.add("monster");
			//定义怪物的样式
			temMon = monsterStyle(temMon);
			//定义怪物的位置 调用函数
			locationByMonster(temMon);
			//加入到con游戏区域中
			con.appendChild(temMon);
			//加入到怪物数据中
			Monster.push(temMon);
		}

		function monsterStyle(temMon) {
			switch (getRandom(1, 3)) {
				case "1":
					temMon.classList.add("monsterA");
					break;
				case "2":
					temMon.classList.add("monsterB");
					break;
				case "3":
					temMon.classList.add("monsterC");
					break;
			}
			return temMon;
		}
		//怪物移动
		function moveMonster(Monster) {
			for (var index = 0; index < Monster.length; index++) {
				Monster[index].style.top = (parseInt(Monster[index].style.top) + 20) + "px";
				//判断游戏结束
				if (parseInt(Monster[index].style.top) > 900) {
					gameOver();
				}
			}
		}
		//用于生成怪物随机位置的函数
		function locationByMonster(temMon) {
			//随机生成top和left的值
			var temMonTop = getRandom(50, 100, fixed = 0);
			var temMonleft = getRandom(50, 1800, fixed = 0);
			temMon.style.top = temMonTop + "px";
			temMon.style.left = temMonleft + "px";
		}
		//生成位置的随机函数
		function getRandom(start, end, fixed = 0) {
			let differ = end - start
			let random = Math.random()
			return (start + differ * random).toFixed(fixed)
		}
		//游戏结束
		function gameOver() {
			clearInterval(intervalByMonster);
			clearInterval(intervalByBullets);
			clearInterval(createM);
			clearInterval(createB);
			console.log("gameover");
			//未完成 
			setTimeout(function () {
				var gameOverMonster = document.getElementsByClassName("monster");
				console.log(gameOverMonster);
				alert("游戏结束");
				//删除页面中的DOM子弹元素和怪物元素
				var gameOverBullets = document.getElementsByClassName("bullets");
				var gameOverMonster = document.getElementsByClassName("monster");
				console.log(gameOverMonster);
				Bullets = [];
				Monster = [];
				for (var index = 0; index < gameOverBullets.length; index++) {
					con.removeChild(gameOverBullets[index]);
				}
				for (var index = 0; index < gameOverMonster.length; index++) {
					con.removeChild(gameOverMonster[index]);
				}
			}, 1000);
		}


		//设定游戏参数模块  
		// 难度增加 
		//怪物生成速度 移动速度 移动步长
		//子弹暂时不做调整 
		//飞机加强 
		//子弹生成速度不做调整 调整移动步长 和移动速度  
		function setup() {
			var setupRangeByNum = document.getElementById("monster-num");
			setupRangeByNum.addEventListener("change", function () {
				document.getElementById("num").innerHTML = this.value;
			})

			var setupRangeBySpeed = document.getElementById("monster-speed");
			setupRangeBySpeed.addEventListener("change", function () {
				document.getElementById("speed").innerHTML = this.value;
			})
		}
		fadeInSetup();
		submitSetup();
		//调出设置界面
		function fadeInSetup() {
			document.addEventListener("keydown", function (e) {
				//移除飞机和鼠标的移动事件
				// con.removeEventListener("mousemove",mousemoveByPlane);
				if (e.keyCode == 27) {
					document.getElementsByClassName("setup-con")[0].style.visibility = "visible";
					clearInterval(intervalByMonster);
					clearInterval(intervalByBullets);
					clearInterval(createM);
					clearInterval(createB);
				}
			})
		}
		//设置页面确定按钮  
		//重写intervalByMonster 和 intervalByBullets 并且修改参数
		function submitSetup() {
			document.getElementsByClassName("submitSetup")[0].addEventListener("click", function () {
				//添加鼠标和飞机的移动事件
				// con.addEventListener("mousemove",mousemoveByPlane);
				var monsterNum = document.getElementById("monster-num").value;
				var monsterSpeed = document.getElementById("monster-speed").value;
				document.getElementsByClassName("setup-con")[0].style.visibility = "hidden";
				//重新定义移动控件
				intervalByMonster = setInterval(function () {
					moveMonster(Monster);
				}, adjustMonsterBySpeed(monsterSpeed))
				intervalByBullets = setInterval(function () {
					moveBullets(Bullets, Monster);
				}, 80);
				createM = setInterval(function () {
					createMonster();
				}, adjustMonsterBynum(monsterNum));
				createB = setInterval(function () {
					createBullets();
				}, 100)
			})
		}
		//调节参数函数
		//怪物数量 
		function adjustMonsterBynum(monsterNum) {
			return 2080 - monsterNum;
		}
		function adjustMonsterBySpeed(monsterSpeed) {
			return 140 - monsterSpeed;
		}
	}
}