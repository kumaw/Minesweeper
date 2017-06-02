"use strict";


class Minesweeper{

	constructor(){
		//属性
		this.width = 30;
		this.height = 38;
		this.rad = 15;
		//位置
		this.position = new Victor(20, 1000);
		//方向
		this.lookat = new Victor(0, 1);;
		//旋转
		this.rotation = 0;
		//速度
		this.speed = 1;
		//最近的地雷位置下标
		this.closeMines;
		//扫到的雷
		this.minesNum = 0;

		//初始化一个神经网络
		this.neuralNet = new NeuralNet(1,2,1,10);
		//理想基因,测试用
		//this.neuralNet.PutWeights([1,0,-1,-0.5,1,0.5])
		//学习后结果
		//this.neuralNet.PutWeights([0.8093479385566732,-0.36485673917210004,-0.7052942858957134,0.5004094529665257,-0.21185608883046025,0.6055228801113733,-0.6335183553914192,0.31767732353374645,-0.6854474093651042,0.008510577163611428,-0.8917255943745921,0.021629549904853246,0.3988248439320818,0.25176543571102933,-0.695182705041886,-0.20789850485107714,0.4387081621227437,-0.8151093118208131,0.4086191562836819,0.37020928301680567,-0.8049519921571984,0.3581238675964785,0.6780179291826485,0.9390707082129608,-0.6171358162242966,0.7196751331399858,-0.39426841494403103,0.31610648192281626,0.7656253151975498,0.7101173055593124,0.28148557283540454,0.4083902783261349,-0.905443147675752,0.297105924301617,-0.5778936405724958,0.6137900575650317,-0.8110548135440927,0.7846894203078864,-0.5205721752025328,0.8296115677093534,0.5062352291587247,-0.3940151603432056])
		this.el;
		//最近的雷
		this.mes = null;
	}
	//findMines
	PutWeights(Weights){
		this.minesNum = 0;
		this.neuralNet.PutWeights(Weights);
	}
	//计算中心点位置，坐标系转换，中心点坐标为正常坐标系
	getCenter(){
		let x = this.position.x + this.width/2;
		let y = this.position.y + this.height/2;
		return new Victor(x, -y);
	}
	//通过中心店计算定点左边
	calculatePosition(center){
		this.position = new Victor(center.x-this.width/2,(-center.y)-this.height/2);
		if(this.position.x<0){
			this.position.x = 1000
		}
		if(this.position.x>1000){
			this.position.x = 0
		}
		if(this.position.y<0){
			this.position.y = 1000
		}
		if(this.position.y>1000){
			this.position.y = 0
		}

		// if(this.position.x<0 || this.position.y<0){
		// 	//转向90度
		// 	this.lookat.rotate(Math.PI);
		// }
		// if(this.position.x>this.el.width || this.position.y>this.el.height){
		// 	//转向90度
		// 	this.lookat.rotate(-Math.PI);
		// }
	
	}
	//检测雷是否是要找的
	move(){
		let center = this.getCenter();
		let newcenter = center.add(new Victor(this.lookat.x*this.speed,this.lookat.y*this.speed));
		this.calculatePosition(newcenter);
	}
	draw(c,mines){
		//计算下一个的位置,根据输入获取转向
		this.el = c

		let mes = this.findCloseMines(mines);

		let input = this.parse(this.lookat,mes);
		//let config = this.neuralNet.Update([mes.position.x,mes.position.y,this.lookat.x,this.lookat.y]);
		//console.log(input);
		let config = this.neuralNet.Update([input]);
		
		this.speed = (config[0]+config[1])*2;
		let RotForce = config[0] - config[1];

		let smallRange = false;
		let smallJuli = false
		//增加适应性评分，新产生的角度在已知角度范围内，并且2点距离会变小 会有增加评分。

		this.lookat.rotate(-Math.PI/180*RotForce*20);
		//this.lookat.rotate(-Math.PI/180*RotForce*10);
		let newInput = this.parse(this.lookat,mes);
		if(Math.abs(newInput)<Math.abs(input)){
			this.minesNum++;
		}
		this.move();

		var ctx=c.getContext("2d");
		var center = this.getCenter();
		ctx.save();
		ctx.translate(center.x, -center.y);
		ctx.rotate(this.lookat.verticalAngle());
		//ctx.rotate(Math.PI);
		ctx.translate(-center.x, center.y);
		ctx.drawImage(mImg,center.x - mImg.width/2,-center.y - mImg.height/2);
		ctx.restore();	

		ctx.beginPath();
		//画指向线
		ctx.moveTo(center.x, -center.y);
		let closeMes = new Victor(mes.position.x-this.position.x,-(mes.position.y-this.position.y));
		let imes = closeMes.norm();
		ctx.lineTo(mes.position.x,mes.position.y);
		ctx.strokeStyle = "red";
  		ctx.stroke();
		//ctx.clearRect(0,0,this.el.width,this.el.height);
		//ctx.drawImage(img,this.position.x,this.position.y);
	}
	parse(lookat,mes){
		let closeMes = new Victor(mes.position.x-this.position.x,-(mes.position.y-this.position.y));
		let cross = lookat.cross(closeMes);
		let dot = lookat.dot(closeMes);
		let a = dot/(lookat.distance(new Victor(0,0))*closeMes.distance(new Victor(0,0)))
		let angle = Math.acos(a);
		if(cross>0){
			return angle
		}else{
			return -angle
		}
	}
	//查找最近的雷
	findCloseMines(mineserror){
		let line = 999000;
		let tempMine;
		let center = this.getCenter();
		mineserror.forEach(item=>{
			let tempLine = center.distance(item.getCenter());
			if(tempLine<line){
				line = tempLine;
				tempMine = item;
			}
		})
		return tempMine;
	}

	//检测是否碰到雷
	checkMines(mines){
		let center = this.getCenter();
		let line = center.distance(mines.getCenter());
		if(line<= this.rad + mines.rad){
			return true
		}
		return false;
	}

	rightMove(angle = -Math.PI/180*10){

		this.lookat.rotate(angle);
	}
	leftMove(angle = Math.PI/180*10){

		this.lookat.rotate(angle);
	}

}