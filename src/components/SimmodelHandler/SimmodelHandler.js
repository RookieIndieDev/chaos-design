import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'

export function withRouter(Children){
	return(props)=>{
		const location = useLocation()
		return <Children {...props} location={location} />
	}
}

class SimmodelHandler extends React.Component{
	constructor(props){
		super(props);
		this.state={
			simmodel:undefined,
			text:"Upload Simmodel to begin.",
			new:false,
			nNet:undefined
		}
	}

	componentDidMount(){
		document.title = "Simmodel Upload"
		this.setState(state => ({
			new: this.props.location.state.new
		}))
	}

	render(){
		let simmodel;
		let nNet;
		let nav = this.state.simmodel !== undefined && this.state.new?<Navigate to={"/editor"} state={{simmodel:this.state.simmodel, nNet:this.state.nNet}} replace={true} />:null
		let nNetUpload = this.props.location.state.new === false&& this.state.simmodel?<label className="px-20 ml-2 rounded-lg py-5 bg-cyan-600 shadow-lg hover:bg-cyan-500 hover:px-24 hover:py-6">
					<span className="text-gray-100 font-semibold select-none">Upload NNet</span>
					<input type="file" className="hidden" accept=".json" onChange={ (e) => 
										{
											if(e.target.files[0].type === "application/json"){
													var fileReader = new FileReader()
													fileReader.readAsText(e.target.files[0])
													fileReader.addEventListener("load", (e) =>{
														nNet = JSON.parse(fileReader.result)
														if(nNet.neurons){
															this.setState(state => ({
																nNet:nNet,
																new:true
															}))
														}
														else{
															this.setState(state => ({
																text:"Invalid nNet, upload a correct nNet"
															}))
														}
													})
												}else{
												this.setState(state => ({
													text:"Invalid file, upload the correct JSON nNet"
												}))
											}
										}

										}/>
					</label>:null
		return(
			<div className="w-full h-screen bg-indigo-700">
				{nav}
				<div>
					<div className="py-44 px-5">
						<p className="text-9xl font-semibold text-gray-100 ml-5 select-none text-left w-7/12">{this.state.text}</p>
					</div>
					<label className="px-20 rounded-lg py-5 bg-cyan-600 shadow-lg hover:bg-cyan-500 hover:px-24 hover:py-6">
					<span className="text-gray-100 font-semibold select-none">Upload Simmodel</span>
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
															}), () => {
																if(!this.props.location.state.new){
																	this.setState( state => ({
																			text:"Upload Your NNet"
																		}))
																	}

															})
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
					{nNetUpload}
				</div>
			</div>
			)
	}
}

export default withRouter(SimmodelHandler)