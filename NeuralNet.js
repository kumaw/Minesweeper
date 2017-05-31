//神经网络
class NeuralNet{
	constructor(inputNum,outputNum,hiddenLayerNum,perHiddenLayerNeuronNum){
		// 输入数据个数
		this.inputNum = inputNum;
		// 输出数据数量
		this.outputNum = outputNum;
		// 隐藏层数量
		this.hiddenLayerNum = hiddenLayerNum;
		// 每个隐藏层内神经元数量
		this.perHiddenLayerNeuronNum = perHiddenLayerNeuronNum;
		// 每层存储器
		this.Layers = [];
		//创建隐藏层
		//创建第一个隐藏层
		this.Layers.push(new NeuronLayer(perHiddenLayerNeuronNum,inputNum));
		for(let i=0;i<hiddenLayerNum-1;i++){
			this.Layers.push(new NeuronLayer(perHiddenLayerNeuronNum,hiddenLayerNum));
		}
		//创建输出层
		this.Layers.push(new NeuronLayer(outputNum,perHiddenLayerNeuronNum));
	}
	//获取权重
	getWeights(){
		let weight = [];
		for(let i = 0;i<this.Layers.length;i++){
			for(let a = 0;a<this.Layers[i].neurons.length;a++){
				weight = weight.concat(this.Layers[i].neurons[a].weights);
			}
		}
		return weight;
	}
	//网络的权重的总数
	GetNumberOfWeights(){
		let weights = 0;
		for (let i=0; i<this.Layers.length; i++){
			for (let j=0; j<this.Layers[i].neuronNum; j++){
				for (let k=0; k<this.Layers[i].neurons[j].inputNum; k++){
					weights++;
			    }
			}
		}
		return weights;

	}
	//获取每层基因点
	CalculateSplitPoints(){
		let SplitPoints = [];
		let WeightCounter = 0;
		for (let i=0; i<this.Layers.length; ++i){
			for (let j=0; j<this.Layers[i].neuronNum; ++j){
				for (let k=0; k<this.Layers[i].neurons[j].inputNum; ++k){
					WeightCounter++;
			    }
			    SplitPoints.push(WeightCounter - 1);
			}
		}


		return SplitPoints;
		
	}

	//替换权重
	PutWeights(weights){
		let ii = 0;
		for(let i = 0;i<this.Layers.length;i++){
			for(let a = 0;a<this.Layers[i].neurons.length;a++){
				for(let b = 0;b<this.Layers[i].neurons[a].weights.length;b++){
					this.Layers[i].neurons[a].weights[b] = weights[ii]
					ii++;
				}
			}
		}
	}
	// S形响应曲线
    Sigmoid(activation,response){
    	return 1/(1+Math.pow(Math.E,-activation/response));
    }

    //输入输出相应
    Update(inputs){
    	//每层输出数据
    	let output = [];
    	let weight = 0
    	//每层处理
    	for(let i=0;i<this.Layers.length;i++){
    		//第一层
    		if(i>0){
    			inputs = output;
    		}
    		output = [];
    		weight = 0
    		for(let a=0;a<this.Layers[i].neurons.length;a++){
    			//对每个输入进行权重计算

    			let neuron = this.Layers[i].neurons[a];
    			for(let b=0;b<inputs.length;b++){
    				weight = weight + inputs[b]*neuron.weights[b];
    			}
    			weight = weight + neuron.weights[neuron.inputNum - 1]*(-1);
    			//输出的权重
    			output.push(this.Sigmoid(weight,1));
    		}
    	}
    	return output;
    }
}