import React from 'react'
import {Rect, Group} from 'react-konva'

class NeuralLayer extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			neuronCount:0,
			hovering:false
		}
		this.groupRef = React.createRef()
		this.onClick = this.onClick.bind(this)
	}

	onClick(e){
		if(this.props.currentSelected !== "" && this.props.type === this.props.baseType){
			this.props.addNeuron(e, this.state.neuronCount)
			this.setState(state => ({
				neuronCount: state.neuronCount+1
			}))	
		}
		console.log(e.target.attrs.id)
		console.log(this.props.id)
	}

	render(){
		var strokeColor;
		switch(this.props.type){
			case "input":
			strokeColor="#10B981"
			break;
			case "middle":
			strokeColor="#0EA5E9"
			break;
			case "output":
			strokeColor="#4F46E5"
			break;
			default:
			strokeColor=""
		}
		return(

			<Group ref={this.groupRef} offsetX={this.props.offsetX} offsetY={this.props.offsetY}>
				<Rect height={this.state.neuronCount > 0? this.state.neuronCount * 60:60} width={220} stroke={strokeColor} cornerRadius={5} name="neuralLayer" 
				opacity={this.state.hovering?0.5:0.1} 
				onMouseEnter={() => this.setState(state => ({hovering: true}))} 
				onMouseLeave={() => this.setState(state => ({hovering: false}))}
				onClick={this.onClick} id={this.props.id}/>
			</Group>
		)
	}
}

export default NeuralLayer