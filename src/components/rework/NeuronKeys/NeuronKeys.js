import {Rect, Text, Group} from 'react-konva';
import React from "react";

class NeuronKeys extends React.Component{
	constructor(props){
		super();
		this.state = {
			hovering:false
		}
	}

	render(){
		return(
			<Group>
				<Rect fill={this.state.hovering?"#0D9488":"#14B8A6"} height={50} width={200} offsetX={-225} offsetY={-80 * (this.props.index)} cornerRadius={5}
				onMouseEnter={() => this.setState(state => ({hovering: true}))} 
				onMouseLeave={() => this.setState(state => ({hovering: false}))}/>
				<Text fill="white" text={this.props.text} offsetX={-250} offsetY={-85 * (this.props.index)} fontStyle="bold" fontFamily="Helvetica" fontSize={20} listening={false}/>
			</Group>
		)
	}
}

export default NeuronKeys;