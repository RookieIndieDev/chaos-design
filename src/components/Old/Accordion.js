import React from "react";
import AccordionChild from './AccordionChild.js'

class Accordion extends React.Component
{
	constructor(props){
		super(props);
		this.state = {isActive: false}
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(){
		this.setState(state => ({
			isActive: !state.isActive
		}))
	}


	render(){
		var accordionStyle = this.state.isActive ? 
		"py-2 xl:w-96 2xl:w-11/12 2xl:mx-4 mb-1 border-white text-white	bg-indigo-400 xl:mx-1 rounded border-b-2 text-left px-4 select-none font-bold": 
		"py-2 xl:w-96 2xl:w-11/12 2xl:mx-4 mb-1 border-white text-gray-50 bg-indigo-300 xl:mx-2 rounded border-b-2 text-left px-4 select-none hover:text-gray-500 hover:bg-indigo-100 font-bold"
		var accordionContent;
		var contentDivStyle = this.state.isActive ? "flex flex-col items-center p-2 mb-2" :
		 "flex flex-col bg-indigo-400 ml-5 items-center"

		if(this.state.isActive){
			accordionContent = this.props.array.map((neuron, index) => 
				<AccordionChild onClick={this.props.onNeuronSelect} value={neuron.$TYPE?neuron.$TYPE:neuron} key={index} currentNeuronId={this.props.currentNeuronId} baseType={this.props.baseType}/>)
		}

		return(
			<div>
				<p className={accordionStyle} onClick={this.handleClick}>{this.props.text}</p>
				<div className={contentDivStyle}>
					{accordionContent}
				</div>
			</div>
			)
	}
}

export default Accordion;