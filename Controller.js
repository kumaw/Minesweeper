"use strict";
class Map{
	constructor(el){
		this.el = el;
		this.mines = [];
		this.minesweepers = [];
		this.tick = 0;
		//代数
		this.generations = 0;

		this.MinesweeperNum = 1
		//基因群体，保存所有的基因序列
		//this.thePopulation = [];

		for(let i = 0;i<this.MinesweeperNum;i++){
			let tank = new Minesweeper()
			this.minesweepers.push(tank);
		}

		let m_NumWeightsInNN = this.minesweepers[0].neuralNet.GetNumberOfWeights();
		let SplitPoints = this.minesweepers[0].neuralNet.CalculateSplitPoints();
		this.gen = new CGenAlg(this.MinesweeperNum,0.1,0.7,0,SplitPoints);

		//创建地雷
		for(let i = 0;i<30;i++){
			let x = Math.random()*1000;
			let y = Math.random()*1000;
			this.mines.push(new Mines(new Victor(x,y)));
		}

	}
	start(){
  		//监听事件


		//定时绘制
		this.drawUp()
		this.handle()
	}
	handle(){
		// document.onkeydown=()=>{
		// 	var e = event || window.event || arguments.callee.caller.arguments[0];
		// 	if(e.keyCode == 68){
		// 		//右偏移
		// 		this.minesweepers[0].rightMove();
		// 	}
		// 	if(e.keyCode == 65){
		// 		//左偏移
		// 		this.minesweepers[0].leftMove();
		// 	}
		// }
	}

	drawUp(){
		requestAnimationFrame(()=>{
			var cxt=this.el.getContext("2d");  
    		cxt.clearRect(0,0,this.el.width,this.el.height);
			this.draw();
			this.drawUp();
		})
	}

	draw(){
		this.tick++; 
		if(this.tick<50000){
			//碰撞检测
			this.minesweepers.forEach(item=>{
				// if(this.tick%100 == 0){
				// 	console.log(item.minesNum);
				// 	item.minesNum = 0
				// }
				this.mines = this.mines.filter(item1=>{
					let has = item.checkMines(item1);
					if(has){
			
						item.minesNum = item.minesNum + 50;
					}
					return !item.checkMines(item1);
				})
				//填补空缺的雷
				for(let i = 0;i<30-this.mines.length;i++){
					let x = Math.random()*1000;
					let y = Math.random()*1000;
					this.mines.push(new Mines(new Victor(x,y)));
				}

				//this.mines.push();
			})

			this.minesweepers.forEach(item=>{
				item.draw(this.el,this.mines);
			})

			this.mines.forEach(item=>{
				item.draw(this.el);
			})
		}else{
			console.log("开始产生下一代");
			//开始遗传算法
			this.tick = 0;
			this.generations++;
			let population = [];
			//获取基因群体
			this.minesweepers.forEach(item=>{
				population.push(new Genome(item.neuralNet.getWeights(),item.minesNum));
			})
			let newpopulation = this.gen.Epoch(population)
			console.log("最优适应值："+this.gen.m_dBestFitness);
			console.log("最优适应基因："+this.gen.bestWeight);
			for(let i = 0;i<this.minesweepers.length;i++){
				//console.log(newpopulation[i]);
				this.minesweepers[i].PutWeights(newpopulation[i].Weights);
			}
			//处理
		}

		
	}

}