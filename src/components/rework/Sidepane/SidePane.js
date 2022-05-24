import React from 'react'
import {Rect, Group, Text} from 'react-konva'
import Accordion from './Accordion/Accordion.js'

class SidePane extends React.Component{
	constructor(){
		super();
		this.state={
			isSidePaneVisible:false,
			selectedId:"",
			prevId:" ",
			outputAccordionY:-100,
			middleAccordionY:-50,
			inputAccordionY:0,
			contentOffsetY:-100
		}
		this.toggleSidePane = this.toggleSidePane.bind(this)
		this.selectItem = this.selectItem.bind(this)
		this.scroll = this.scroll.bind(this)
	}

	toggleSidePane(){
		this.setState(state => ({
			isSidePaneVisible: !state.isSidePaneVisible
		}))
	}

	selectItem(e){
		if(this.state.prevId === "")
			this.setState(state => ({prevId:e.target.attrs.name}))
		this.setState(state=>({
			selectedId:e.target.attrs.name,
			contentOffsetY:-100
		}))
		this.updateOffsets()
	}

	updateOffsets(){
		if(this.state.prevId === this.state.selectedId){
			this.setState(state => ({selectedId:"",
				prevId:" "
		}))
			this.setState(state =>({
				middleAccordionY:-50,
				outputAccordionY:-100,
			}))
		}else if(this.state.selectedId === "input"){
			var outputOffset=this.props.inputNeurons.length * -95;
			var middleOffset=this.props.inputNeurons.length * -80;
			this.setState(state => ({
				outputAccordionY:outputOffset,
				middleAccordionY:middleOffset,
				prevId:"input"
			}))
			this.props.setBaseType("input")
		}else if(this.state.selectedId === "middle"){
			outputOffset=this.props.middleNeurons.length * -90
			this.setState(state => ({
				outputAccordionY:outputOffset,
				middleAccordionY:-50,
				prevId:"middle"
			}))
			this.props.setBaseType("middle")
		}else if(this.state.selectedId === "output"){
			middleOffset=-50
			this.setState(state =>({
				middleAccordionY:middleOffset,
				outputAccordionY:-100,
				prevId:"output"
			}))
			this.props.setBaseType("output")
		}
	}

	scroll(e){
		if(this.state.isSidePaneVisible){
			if(e.evt.deltaY < 0){
				this.setState(state => ({
					contentOffsetY:Math.max(state.contentOffsetY -20, -150)
				}))
			}else{
				//up
				this.setState(state => ({
					contentOffsetY:Math.min(state.contentOffsetY + 20, 50 * this.props.inputNeurons.length)
				}))
			}
		}
	}

	render(){
		var opacity = this.state.isSidePaneVisible?0.5:0
		var header = this.state.isSidePaneVisible?<Text text="ChaosDesign" fill="white" offsetX={-20} offsetY={-20} fontSize={35} fontStyle="bold" fontFamily="Helvetica"/>:null
		let titleSection = this.state.isSidePaneVisible?<Rect height={70} fill="#6366F1" width={this.state.isSidePaneVisible?300:50} shadowColor="black"
						shadowOffsetX={15} 
						shadowBlur={50}
						shadowOpacity={opacity}/>:null
		let scrollInstructions = this.state.isSidePaneVisible?<Text text="Use mouse wheel to scroll up and down. Click any empty space to toggle side pane" fill="white" 
		offsetX={-20} offsetY={-900} fontSize={12} fontStyle="bold" fontFamily="Helvetica" wrap="word" width={200}/>:null
		var contents = this.state.isSidePaneVisible?
			<Group offsetX={-10} offsetY={this.state.contentOffsetY}>
					<Accordion text="Inputs" offsetY={this.state.inputAccordionY} items={this.props.inputNeurons} 
					id="input" selectedId={this.state.selectedId} selectItem={this.selectItem} onAccordionSelect={this.props.onAccordionItemSelect} 
					currentSelected={this.props.currentSelected}/>
					<Accordion text="Middle" offsetY={this.state.middleAccordionY} items={this.props.middleNeurons} 
					id="middle" selectedId={this.state.selectedId} selectItem={this.selectItem} onAccordionSelect={this.props.onAccordionItemSelect} 
					currentSelected={this.props.currentSelected}/>
					<Accordion text="Outputs" offsetY={this.state.outputAccordionY} items={this.props.outputNeurons} 
					id="output" selectedId={this.state.selectedId} selectItem={this.selectItem} onAccordionSelect={this.props.onAccordionItemSelect} 
					currentSelected={this.props.currentSelected}/>
				</Group>:
				<Group listening={false}>
					<Rect height={20} width={25} stroke="white" offsetX={-10} offsetY={-10}/>
					<Rect height={0} width={15} stroke="white" offsetX={-15} offsetY={-15}/>
					<Rect height={0} width={15} stroke="white" offsetX={-15} offsetY={-20}/>
					<Rect height={0} width={15} stroke="white" offsetX={-15} offsetY={-25}/>
				</Group>
		return(
			<Group>
				<Rect height={window.innerHeight} fill="#6366F1" width={this.state.isSidePaneVisible?300:50} shadowColor="black"
						shadowOffsetX={15} 
						shadowBlur={50}
						shadowOpacity={opacity} 
						onClick={this.toggleSidePane} name="sidePane" onWheel={this.scroll}/>
				{scrollInstructions}
				{contents}
				{titleSection}
				{header}
			</Group>
			)
	}
}

export default SidePane