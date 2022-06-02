import { Rect, Text, Group } from 'react-konva';
import React from "react";

class CopyNeuron extends React.Component{
	constructor(props){
		super(props);
		this.state ={

		}
	}

	render(){
		return(
				<Group name="CopyNeuron" x={this.props.X} y={this.props.Y}>
					<Rect fill="#7DD3FC" cornerRadius={20} width={130} height={50} opacity={0.9} shadowColor="gray" shadowOffsetY={5} shadowOpacity={0.7} shadowBlur={5} offsetY={-10}/>
					<Rect fill="#38BDF8" cornerRadius={20} width={130} height={50} opacity={0.9} shadowColor="gray" shadowOffsetY={5} shadowOpacity={0.7} shadowBlur={10} offsetY={-5}/>
					<Rect fill="#0EA5E9" cornerRadius={20} width={130} height={50} opacity={1} shadowColor="gray" shadowOffsetY={5} shadowOpacity={0.7} shadowBlur={20}/>
					<Text text={this.props.count} offsetX={-60} offsetY={-20} fill="#FAFAFA" fontFamily="Helvetica" fontSize={20} fontStyle="bold"/>
				</Group>
			)
	}
}

export default CopyNeuron;