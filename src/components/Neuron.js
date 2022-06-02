import React from 'react'
import {Rect, Group, Text} from 'react-konva'
//Remove?
class Neuron extends React.Component{
	constructor(props){
		super()
		this.state={
			id:props.neuronId,
			type:props.neuronType
		}
		this.onClick = this.onClick.bind(this)
	}

	onClick(e){
		this.props.onClick(this.state.id)
	}

	render(){
		var fillColor;
		switch(this.props.baseType){
			case "input":
			fillColor="#10B981"
			break;
			case "middle":
			fillColor="#0EA5E9"
			break;
			case "output":
			fillColor="#4F46E5"
			break;
			default:
			fillColor=""
		}
		return(
			<Group>
				<Rect height={50} width={130} fill={fillColor} stroke="white" offsetX={this.props.offsetX} offsetY={this.props.offsetY} cornerRadius={5}
				 opacity={0.40} name="neuron" onClick={this.onClick}/>
				<Text wrap="char" width={130} text={this.state.type} fill="white" offsetY={this.props.offsetY - 10} offsetX={this.props.offsetX - 15} listening={false}/>
				<Text wrap="char" width={130} text={"id:" + this.state.id} fill="white" offsetY={this.props.offsetY - 25} offsetX={this.props.offsetX - 25} listening={false}/>
			</Group>
		)
	}
}

export default Neuron;