import React from 'react'

class SimmodelHandler extends React.Component{
	constructor(){
		super();
		this.state={
			simmodel:null,
			text:"Upload Simmodel to begin."
		}
	}

	render(){
		let simmodel;

		return(
			<div className="w-full h-screen bg-indigo-700">
				<div>
					<div className="py-44 px-5">
						<p className="text-9xl font-semibold text-gray-100 ml-5 select-none text-left w-7/12">{this.state.text}</p>
					</div>
					<label className="px-20 rounded-lg py-5 bg-cyan-600 shadow-lg hover:bg-cyan-500 hover:px-24 hover:py-6">
					<span className="text-gray-100 font-semibold">Upload</span>
					<input type="file" className="hidden" accept=".json" onChange={ (e) => 
										{
											if(e.target.files[0].type === "application/json"){
													var fileReader = new FileReader()
													fileReader.readAsText(e.target.files[0])
													fileReader.addEventListener("load", (e) =>{
														simmodel = JSON.parse(fileReader.result)
														if(simmodel.inputNeurons && simmodel.activators && simmodel.outputNeurons){
															this.setState(state => ({
																simmodel:simmodel,
																text:"Done."
															}))
														}
														else{
															this.setState(state => ({
																text:"Invalid Simmodel, upload a correct simmodel"
															}))
														}
													})
												}else{
												this.setState(state => ({
													text:"Invalid file, upload the correct JSON Simmodel"
												}))
											}
										}

										}/>
					</label>
				</div>
			</div>
			)
	}
}

export default SimmodelHandler;