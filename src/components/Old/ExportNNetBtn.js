import React from "react"
import { Group, Rect, Text} from 'react-konva'

class ExportNNetBtn extends React.Component
{
	constructor(props){
		super(props)
		this.state={
			isHovering:false
		}
		this.onClick = this.onClick.bind(this)
	}

	onClick(){
		this.props.onClick();
	}

	render(){
		return(
				<Group x={window.innerWidth * 0.45} y={window.innerHeight * 0.85} onClick={this.onClick} 
				onMouseEnter={() => this.setState(state => ({isHovering: true}))} onMouseLeave={() => this.setState(state => ({isHovering:false}))}>
				 	<Rect width={150} height={50} fill={this.state.isHovering?"#34D399":"#10B981"} cornerRadius={5} strokeEnabled={false} shadowColor="gray" shadowBlur={10} shadowOffsetY={5} shadowOffsetX={5}/>
				 	<Text text="Export Neural Net" offsetX={-15} offsetY={-19} fontSize={15} fill="white" align="center"/>
				</Group>
			)
	}	
}

export default ExportNNetBtn;