import {Rect, Text, Group} from 'react-konva';
import React from "react";
import NeuronKeys from '../NeuronKeys/NeuronKeys.js'
class NeuronInfo extends React.Component{
	constructor(props){
		super();
		this.state={
			hoveringOverClose:false,
			hoveringOverSave:false
		}
	}

	render(){
		let keys = this.props.keys.map((item, index) => <NeuronKeys index={index+1} text={item}/>)
		return(
			<Group offsetY={-window.innerHeight * 0.20} offsetX={-window.innerWidth * 0.30}>
				<Rect offsetX={575} y={-190} width={window.innerWidth} height={window.innerHeight} opacity={0.2} fill="black"/>
				<Rect cornerRadius={20} width={650} height={550} fill="white" shadowBlur={50} shadowColor="grey" shadowOffsetY={5} shadowOffsetX={5}/>
				<Text text="Neuron Info" fill="#475569" offsetY={-25} offsetX={-25} fontSize={25} fontStyle="bold" fontFamily="Helvetica"/>
				<Text text={"Selected Neuron " + this.props.selected} fill="#64748B" offsetY={-50} offsetX={-25} fontSize={20} fontStyle="bold" fontFamily="Helvetica"/>
				<Text text="Close X" fill={this.state.hoveringOverClose?"#64748B":"#94A3B8"} offsetY={-15} offsetX={-550} fontSize={20} shadowOffsetY={3} shadowBlur={1} fontStyle="bold" fontFamily="Helvetica" shadowColor="#E2E8F0" onClick={this.props.close} 
				onMouseEnter={() => this.setState(state => ({hoveringOverClose: true}))} 
				onMouseLeave={() => this.setState(state => ({hoveringOverClose: false}))}/>
				{keys}
				<Rect fill={this.state.hoveringOverSave?"#22C55E":"#4ADE80"} width={200} height={50} cornerRadius={25} offsetX={-235} offsetY={-450} shadowOffsetY={4} shadowBlur={2} shadowColor="#CBD5E1"
				onMouseEnter={() => this.setState(state => ({hoveringOverSave: true}))} 
				onMouseLeave={() => this.setState(state => ({hoveringOverSave: false}))}
				/>
				<Text text="Save" listening={false} fill="white" offsetY={-465} offsetX={-310} fontSize={20} fontStyle="bold" fontFamily="Helvetica"/>
			</Group>
			)
	}
}

export default NeuronInfo;