import React from 'react'
import {Rect, Text, Group} from 'react-konva'

class ExportButton extends React.Component{
	constructor(props){
		super(props)
		this.state={
			hovering:false
		}
		this.onClick=this.onClick.bind(this)
	}

	onClick(){
		this.props.export()
	}

	render(){
		return(
			<Group offsetY={-850} offsetX={-1500}>
				<Rect offsetY={-5} offsetX={0} width={150} height={50} fill="#7DD3FC" cornerRadius={5} listening={false} />
				<Rect offsetY={0} offsetX={0} width={150} height={50} fill={this.state.hovering?"#0369A1":"#0EA5E9"} cornerRadius={5} onClick={this.onClick}
				onMouseEnter={() => this.setState(state => ({hovering: true}))} 
				onMouseLeave={() => this.setState(state => ({hovering: false}))} 
				/>
				<Text text="Export" fill="white" offsetY={-20} offsetX={-50} listening={false} fontStyle="bold" fontSize={15}/>
			</Group>
			)
	}
}

export default ExportButton;