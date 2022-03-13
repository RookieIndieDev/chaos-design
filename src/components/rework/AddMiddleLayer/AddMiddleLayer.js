import React from "react";
import {Group, Text, Rect} from "react-konva"

class AddMiddleLayer extends React.Component
{
	constructor(){
		super();
		this.state ={

		}
		this.onClick = this.onClick.bind(this);
	}

	onClick(){
		this.props.addMiddleLayer()
	}

	render(){
		return(
			<Group offsetY={-500} offsetX={-100} draggable>
				<Rect offsetY={-5} offsetX={0} width={150} height={50} fill="#A3E635" cornerRadius={5} />
				<Rect offsetY={0} offsetX={0} width={150} height={50} fill="#65A30D" cornerRadius={5} onClick={this.onClick}/>
				<Text text="Add a middle layer" fill="white" offsetY={-20} offsetX={-20}/>
			</Group>
			)
	}
}

export default AddMiddleLayer;