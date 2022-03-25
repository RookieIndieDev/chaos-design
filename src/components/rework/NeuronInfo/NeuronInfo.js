import {Rect, Text, Group} from 'react-konva';
import React from "react";

class NeuronInfo extends React.Component{
	constructor(){
		super();
		this.state ={

		}
	}

	render(){
		return(
			<Group offsetY={-window.innerHeight * 0.20} offsetX={-window.innerWidth * 0.40}>
				<Rect cornerRadius={20} width={500} height={500} fill="red" shadowBlur={1000} shadowColor="grey" shadowOffsetY={5} shadowOffsetX={5}/>
			</Group>
			)
	}
}

export default NeuronInfo;