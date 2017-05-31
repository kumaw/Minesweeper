//单个神经元
class Neuron{
	
	constructor(num){
		//神经元接受数据个数
		this.inputNum = num + 1;
		this.weights = [];
		//输入权重
		for(let i=0 ;i<this.inputNum;i++){
			//权重为1到-1的值
			this.weights.push(RandomClamped());
		}

	}
}
//产生1到-1的数
function RandomClamped()
{   
	var Range = 2;   
	var Rand = Math.random();   
	return -1 + Rand * Range;   
} 