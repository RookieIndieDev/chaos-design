import React from 'react'
import {Rect, Group, Text} from 'react-konva'
import AccordionChild from './AccordionChild.js'

class Accordion extends React.Component{
	constructor(props){
		super()
		this.state={
			items:props.items,
			clicked:false,
			id:props.id,
			hovering:false
		}
		this.click = this.click.bind(this)
	}
	
	click(e){
		this.props.selectItem(e)
	}

	render(){
		var children = this.props.selectedId===this.state.id?this.state.items.map((item, index)=>
				<AccordionChild offsetY={-index * 60} text={item.$TYPE?item.$TYPE:item} onAccordionSelect={this.props.onAccordionSelect} 
				type={this.props.text} currentSelected={this.props.currentSelected} key={index}/>
			):null
		return(
			<Group offsetY={this.props.offsetY}>
				<Rect height={40} fill={this.state.hovering?"#E5E7EB":"#F9FAFB"} width={250} cornerRadius={5} 
				onMouseDown={this.click} name={this.props.id}
				onMouseEnter={() => this.setState(state => ({hovering: true}))} 
				onMouseLeave={() => this.setState(state => ({hovering: false}))}
				/>
				<Text text={this.props.text} fill="#6366F1" offsetX={-85} offsetY={-10} fontSize={25} fontStyle="bold" fontFamily="Calibri" listening={false}/>
				{children}
			</Group>
		)
	}
}

export default Accordion