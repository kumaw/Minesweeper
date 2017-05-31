class NeuronLayer{
	constructor(neuronNum,inputNum){
		//本层神经细胞数量
		this.neuronNum = neuronNum;
		this.neurons = [];
		for(let i=0;i<neuronNum;i++){
			this.neurons.push(new Neuron(inputNum));
		}
	}
	
	
}