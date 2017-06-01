class CGenAlg{
	constructor(NumSweepers,MutationRate,CrossoverRate,NumWeightsInNN,SplitPoints){
		this.reset()
		this.old = [];
		this.new = [];

		this.popsize = NumSweepers;
		this.MutationRate = MutationRate;
		this.CrossoverRate = CrossoverRate;
		this.ChromoLength = NumWeightsInNN;
		this.SplitPoints = SplitPoints;
		this.m_vecPop = [];
		//m_dMutationRate = 
		// for(let i=0;i<this.popsize;i++){

		// }

	}
	//变异
	Mutate(chromo){
		for(let i=0;i<chromo.length;i++){
			if(Math.random()>this.MutationRate){
				chromo[i] = chromo[i] + RandomClamped()*0.5
			}
		}
		return chromo;
	}
	//交叉分裂
	//参数均为数组
	CrossoverAtSplits(mum,dad){

		let baby1 = [],baby2 = [];
		if(Math.random()>this.CrossoverRate || mum == dad ){
			baby1 = mum;
			baby2 = dad;
			return {baby1,baby2};
		}
		let Index1 = RandInt(0, this.SplitPoints.length-2);
  		let Index2 = RandInt(Index1, this.SplitPoints.length-1);
  		let cp1 = this.SplitPoints[Index1];
  		let cp2 = this.SplitPoints[Index2];
  		for(let i=0;i<mum.length;i++){
  			if ( (i<cp1) || (i>=cp2) ){
  				baby1.push(mum[i]);
  				baby2.push(dad[i]);
  			}else{
  				baby1.push(dad[i]);
 				baby2.push(mum[i]);
  			}
  		}
  		return {baby1,baby2};

	}

	//自然选择 随机选择n次，并从中取适应性最强的基因
	TournamentSelection(n){
		let BestFitnessSoFar = -999999;
		let ChosenOne = 0;
		for(let i=0;i<n;i++){
  			let ThisTry = RandInt(0,this.popsize-1);
  			if(this.m_vecPop[ThisTry].dFitness>BestFitnessSoFar){
  				ChosenOne = ThisTry;
  				BestFitnessSoFar = this.m_vecPop[ThisTry].dFitness;
  			}
  		}
  		return this.m_vecPop[ChosenOne];
	}

	//产生新群体
	Epoch(old_pop){
		this.reset()
		this.m_vecPop = old_pop;
		let newPop = [];
		this.CalculateBestWorstAvTot();
		//升序排列
		this.m_vecPop.sort((a,b)=>{
			return a.dFitness - b.dFitness
		})
		//是否使用精英选择
		if (!(CParams.iNumCopiesElite * CParams.iNumElite % 2))
		{
			newPop = this.GrabNBest(CParams.iNumElite, CParams.iNumCopiesElite);
		}
		//补充群体
		while (newPop.length < this.popsize){
			let mum = this.TournamentSelection(4);
			let dad = this.TournamentSelection(4);

			let {baby1,baby2} = this.CrossoverAtSplits(mum.Weights, dad.Weights);
			this.Mutate(baby1);
			this.Mutate(baby2);
			newPop.push(new Genome(baby1));
			newPop.push(new Genome(baby2));
		}
		this.m_vecPop = newPop;
		return newPop;

	}
	//选取精英副本
	//NBest选择前几作为精英，NumCopies复制的数量
	GrabNBest(NBest,NumCopies){
		let pop = []
		while(NBest--){
			for (let i=0; i<NumCopies; i++){
				pop.push(this.m_vecPop[(this.popsize - 1) - NBest]);
		 	}
		}
		return pop;
	}

	//计算最好和最坏的基因序列的平均值
	CalculateBestWorstAvTot(){
		this.m_dTotalFitness = 0;
		let HighestSoFar = 0;
		let LowestSoFar  = 9999999;
		//最好的
		for (let i=0; i<this.popsize; i++){
			if(this.m_vecPop[i].dFitness > HighestSoFar){
				HighestSoFar = this.m_vecPop[i].dFitness;
				this.m_iFittestGenome = i;
				this.m_dBestFitness = HighestSoFar;
			}
			if(this.m_vecPop[i].dFitness < LowestSoFar){
				LowestSoFar = this.m_vecPop[i].dFitness;
				this.m_dWorstFitness = LowestSoFar;
			}

			this.m_dTotalFitness += this.m_vecPop[i].dFitness
		}
		this.m_dAverageFitness = this.m_dTotalFitness / this.popsize;
	}
	reset(){
		this.m_dTotalFitness= 0;
		this.m_dBestFitness= 0;
		this.m_dWorstFitness= 9999999;
		this.m_dAverageFitness= 0;
	}

	
}
function RandInt(Min,Max)
{   
	var Range = Max - Min;   
	var Rand = Math.random();   
	return parseInt(Min + Math.round(Rand * Range));   
}   