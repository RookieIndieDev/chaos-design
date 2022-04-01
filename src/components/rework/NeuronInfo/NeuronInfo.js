import {Rect, Text, Group} from 'react-konva';
import React from "react";

class NeuronInfo extends React.Component{
	constructor(props){
		super();
	}

	render(){
		let keys = this.props.keys.map((item, index) => <Text fill="white" text={item} offsetX={-25} offsetY={-50 * (index + 1)} fontStyle="bold" fontFamily="Calibri" fontSize={20}/>)
		return(
			<Group offsetY={-window.innerHeight * 0.20} offsetX={-window.innerWidth * 0.40}>
				<Rect cornerRadius={20} width={500} height={500} fill="red" shadowBlur={1000} shadowColor="grey" shadowOffsetY={5} shadowOffsetX={5}/>
				<Text text={"Selected Neuron: " + this.props.selected} fill="white" offsetY={-10} offsetX={-25} fontSize={30} fontStyle="bold" fontFamily="Calibri"/>
				<Text text="X" fill="white" offsetY={-10} offsetX={-450} fontSize={45} shadowOffsetY={5} shadowBlur={10} fontStyle="bold" fontFamily="Calibri" onClick={this.props.close}/>
				{keys}
			</Group>
			)
	}
}

export default NeuronInfo;