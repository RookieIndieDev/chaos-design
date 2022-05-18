import React from "react"

class AccordionChild extends React.Component
{
	constructor(props){
		super(props);
		this.state ={
			id: Math.floor(Math.random() * 10000)
		}
		this.onSelect = this.onSelect.bind(this)
	}

	onSelect(e){
		this.props.onClick(e, this.props.baseType)
	}

	render(){
		var style = this.state.id === this.props.currentNeuronId ? 
		"rounded bg-blue-700 hover:bg-blue-500 w-80 2xl:w-11/12 my-1 mb-1 h-10 shadow-lg ring-2 ring-white select-none text-gray-50 py-1 text-sm font-bold truncate":
		"rounded bg-indigo-300 hover:bg-indigo-200 w-80 2xl:w-11/12 mb-1 shadow-md border-b-2 border-white select-none text-gray-50 py-1 text-sm font-bold truncate"
		return(
				<p id={this.state.id} className={style} onClick={this.onSelect}>{this.props.value}</p>
			)
	}
}

export default AccordionChild;