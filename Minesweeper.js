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
		this.neuralNet = new NeuralNet(1,2,1,1);
		this.el;
	}
	//找到最近的雷
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
		if(this.position.x<0 || this.position.y<0){
			//转向90度
			this.lookat.rotate(Math.PI/180*90);
		}
		if(this.position.x>this.el.width || this.position.y>this.el.height){
			//转向90度
			this.lookat.rotate(-Math.PI/180*90);
		}
	
	}
	move(){
		let center = this.getCenter();
		let newcenter = center.add(new Victor(this.lookat.x*this.speed,this.lookat.y*this.speed));
		this.calculatePosition(newcenter);
	}
	draw(c,mines){
		//计算下一个的位置,根据输入获取转向
		this.el = c
		let mes = this.findCloseMines(mines);
		let input = this.parse(mes);
		//let config = this.neuralNet.Update([mes.position.x,mes.position.y,this.lookat.x,this.lookat.y]);
		//console.log(input);
		let config = this.neuralNet.Update([input]);
		this.speed = (config[0]+config[1])*2;
		let RotForce = config[0] - config[1];

		this.lookat.rotate(Math.PI/180*RotForce*2);

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
	parse(mes){
		let closeMes = new Victor(mes.position.x-this.position.x,-(mes.position.y-this.position.y));
		let cross = this.lookat.cross(closeMes);
		let dot = this.lookat.dot(closeMes);
		let a = dot/(this.lookat.distance(new Victor(0,0))*closeMes.distance(new Victor(0,0)))
		let angle = Math.acos(a)*Math.PI/180;
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