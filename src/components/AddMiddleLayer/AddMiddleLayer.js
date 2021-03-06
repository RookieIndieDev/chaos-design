import React from "react";
import {Group, Text, Rect} from "react-konva"

class AddMiddleLayer extends React.Component
{
	constructor(){
		super();
		this.state ={
			hovering:false
		}
		this.onClick = this.onClick.bind(this);
	}

	onClick(e){
		this.props.addMiddleLayer()
	}

	render(){
		return(
			<Group offsetY={-850} offsetX={-1700}>
				<Rect offsetY={-5} offsetX={0} width={150} height={50} fill="#A3E635" cornerRadius={5} listening={false} />
				<Rect offsetY={0} offsetX={0} width={150} height={50} fill={this.state.hovering?"#4D7C0F":"#65A30D"} cornerRadius={5} onClick={this.onClick}
				onMouseEnter={() => this.setState(state => ({hovering: true}))} 
				onMouseLeave={() => this.setState(state => ({hovering: false}))} 
				/>
				<Text text="Add a middle layer" fill="white" offsetY={-20} offsetX={-20} listening={false}/>
			</Group>
			)
	}
}

export default AddMiddleLayer;