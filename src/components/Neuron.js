import React from 'react'
import { Group, Rect, Text, Circle } from 'react-konva'

class Neuron extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			isSelected:false
		}
	}

	render(){
		return(
			<Group x={this.props.x} offsetY={this.props.offsetY} offsetX={-15}>
				<Rect fill={this.props.color} width={120} height={50} strokeEnabled={false} cornerRadius={5}/> 
				<Text text={this.props.currentNeuron} wrap="char" width={120} fontSize={10} padding={20} />
				<Text text={this.props.id} wrap="char" width={130} height={50} fontSize={10} padding={30} />
				<Circle radius="" />
			</Group>
			)
	}
	
}

export default Neuron