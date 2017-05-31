//单个神经元
class Neuron{
	
	constructor(num){
		//神经元接受数据个数
		this.inputNum = num + 1;
		this.weights = [];
		//输入权重
		for(let i=0 ;i<this.inputNum;i++){
			this.weights.push(Math.random());
		}

	}
}

