import React from 'react'
import {Rect, Text, Group} from 'react-konva'

class AccordionChild extends React.Component{
	constructor(props){
		super()
		this.state={
			hovering:false
		}
		this.onSelect = this.onSelect.bind(this)
	}

	onSelect(e){
		this.props.onAccordionSelect(e,this.props.baseId+this.props.id)
	}

	render(){
		return(
			<Group offsetY={this.props.offsetY}>
				<Rect fill={this.state.hovering?"#E5E7EB":"#F9FAFB"} height={60} cornerRadius={5} width={220} offsetX={-10} offsetY={-50}
					onMouseEnter={() => this.setState(state => ({hovering: true}))} 
					onMouseLeave={() => this.setState(state => ({hovering: false}))} onClick={this.onSelect} 
					stroke={this.props.baseId+this.props.id === this.props.currentSelected?"#4ADE80":"#6366F1"} strokeWidth={5}/>
				<Text text={this.props.text} fill="#6366F1" offsetX={-65} offsetY={-60} fontSize={15} fontStyle="bold" fontFamily="Calibri" wrap="char" width={100} listening={false}/>
			</Group>
		)
	}
}

export default AccordionChild