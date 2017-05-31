"use strict";

class Mines{
	constructor(position){
		this.width = 10;
		this.height = 10;
		this.rad = 5;
		//位置
		this.position = position;
	}
	draw(c){
		var ctx=c.getContext("2d");
        //设定填充图形的样式  
        ctx.fillStyle = "red";  
        //绘制图形  
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height);  

	}
	getCenter(){
		let x = this.position.x + this.width/2;
		let y = this.position.y + this.height/2;
		return new Victor(x, -y);
	}


}