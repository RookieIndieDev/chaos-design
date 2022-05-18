import React from "react"; 
import '../index.css';
import SidePaneOpenIcon from './SidePaneOpenIcon.js'
import Accordion from './Accordion.js'

class SidePane extends React.Component
{
	constructor(props){
		super(props);
		this.state = {
			isVisible: true,
			latestAccordionChildId:0,
			isSearching: false,
			searchInputNeurons:[],
			searchMiddleNeurons:[],
			searchOutputNeurons:[],
			searchText:"",
			searchBaseType:""
		}
		this.handleClick = this.handleClick.bind(this)
		this.onSearchFocus = this.onSearchFocus.bind(this)
		this.onSearchClear = this.onSearchClear.bind(this)
		this.onSearchChange = this.onSearchChange.bind(this)
	}

	handleClick(){
		this.setState(state => ({
			isVisible: !state.isVisible
		}))
	}

	onSearchFocus(e){
		this.setState(state => (
		{
			isSearching: true
		}))
	}

	onSearchClear(){
		this.setState(state => (
		{
			isSearching: false,
			searchText:"",
			searchResults:[]
		}))
	}

	onSearchChange(e){
		var tempInput = []
		var tempMiddle = []
		var tempOutput = []
		this.setState(state =>(
		{
			searchText: e.target.value
		}))

		this.props.inputNeurons.forEach(neuron => {
								if(neuron.$TYPE.includes(this.state.searchText))
									tempInput.push(neuron)
							})

		this.setState(state => ({
			searchInputNeurons: tempInput
		}))

		this.props.activators.forEach(value => {
								if(value.includes(this.state.searchText))
									tempMiddle.push(value)
							})

		this.setState(state => ({
			searchMiddleNeurons: tempMiddle
		}))
		

		this.props.outputNeurons.forEach(neuron => {
								if(neuron.$TYPE.includes(this.state.searchText))
									tempOutput.push(neuron)
							})

		this.setState(state => ({
			searchOutputNeurons: tempOutput
		}))
	}


	render(){
		var panelStyle = this.state.isVisible ? "w-1/3 bg-indigo-500 text-xl" : "w-12 bg-indigo-500"
		var content;
		var paneTop;
		if(this.state.isVisible)   
		{
			paneTop = <div className="flex justify-around border-b-2 mb-2 shadow-md">
				<div className="rounded-3xl my-4 py-2 bg-white w-3/4 flex flex-row justify-around">
					<input type="text" className="placeholder-gray-300 text-center"
					placeholder="Search here" onFocus={(e) => this.onSearchFocus(e)} value={this.state.searchText} onChange={this.onSearchChange}></input>
					<p className="text-xl font-semibold text-gray-300 mb-2 hover:text-gray-400 select-none" onClick={this.onSearchClear}>x</p>
				</div>
				<p className="text-lg hover:text-gray-50 text-gray-300 mt-2 font-semibold select-none" onClick={this.handleClick}>X</p>
			</div>
			if(!this.state.isSearching)
			{
				content = 
					<div className="overflow-y-scroll overflow-x-visible h-screen py-2">
						<Accordion text="Inputs" onNeuronSelect={this.props.onNeuronSelect} array={this.props.inputNeurons} currentNeuronId={this.props.currentNeuronId} 
						onSelect={this.props.onAccordionSelect} baseType="input"/>
						<Accordion text="Middle" onNeuronSelect={this.props.onNeuronSelect} array={this.props.activators} currentNeuronId={this.props.currentNeuronId} 
						onSelect={this.props.onAccordionSelect} baseType="middle"/>
						<Accordion text="Outputs" onNeuronSelect={this.props.onNeuronSelect} array={this.props.outputNeurons} currentNeuronId={this.props.currentNeuronId}
						 onSelect={this.props.onAccordionSelect} baseType="output"/>
					</div>

			}
			else{
				content=
					<div className="overflow-y-scroll overflow-x-visible h-screen py-2">
						<Accordion text="Inputs" onNeuronSelect={this.props.onNeuronSelect} array={this.state.searchInputNeurons} currentNeuronId={this.props.currentNeuronId} 
						onSelect={this.props.onAccordionSelect} baseType="input"/>				
						<Accordion text="Middle" onNeuronSelect={this.props.onNeuronSelect} array={this.state.searchMiddleNeurons} currentNeuronId={this.props.currentNeuronId} 
						onSelect={this.props.onAccordionSelect} baseType="middle"/>						
						<Accordion text="Outputs" onNeuronSelect={this.props.onNeuronSelect} array={this.state.searchOutputNeurons} currentNeuronId={this.props.currentNeuronId} 
						onSelect={this.props.onAccordionSelect} baseType="output"/>
					</div>
			}

		}
			else
			{
				content = 
				<div onClick={this.handleClick}>
					<SidePaneOpenIcon />
				</div>
			}

		return(
			<div className={panelStyle}>
				{paneTop}
				{content}
			</div>
			)
	}
}

export default SidePane;