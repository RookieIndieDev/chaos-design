import '../../index.css';
import { Stage, Layer, Rect, Text, Group, Circle, Line } from 'react-konva';
import React from "react";
import SidePane from './SidePane.js'
import NeuralLayer from './NeuralLayer.js'
import Simmodel from '../../chaosnet/terrariaSimmodel.json'
import FullyConnectButton from './FullyConnectButton.js'

class Test extends React.Component
{
	constructor(){
		super();
		this.state = {
			layerScaleX:1,
			layerHeight: 500,
			dragBoxHeight:0,
			dragBoxWidth: 0,
			isDragging: false,
			selectorBoxX:0,
			selectorBoxY:0,
			middleLayers:[],
			neurons:[],
			totalNumberOfNeurons:0,
			currentAccordionItemType:"",
			baseType:"",
			lastLayerId:2,
			selectedNeurons:[],
			isShiftSelecting:false,
			nLayers:[{
				type:"input",
				id:1
			},{
				type:"output",
				id:2
			}]
		}
		this.zoom = this.zoom.bind(this)
		this.onBoxDragStart = this.onBoxDragStart.bind(this)
		this.onBoxDragEnd = this.onBoxDragEnd.bind(this)
		this.onBoxMove = this.onBoxMove.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
		this.onAccordionItemSelect = this.onAccordionItemSelect.bind(this)
		this.addNeuron = this.addNeuron.bind(this)
		this.setBaseType = this.setBaseType.bind(this)
		this.clickOnNeuron = this.clickOnNeuron.bind(this)
		this.onKeyUp = this.onKeyUp.bind(this)
		this.stageRef = React.createRef()
		this.neuronRef = React.createRef()
	}

	onAccordionItemSelect(e){
		this.setState( state => ({
			currentAccordionItemType:e.target.parent.children[1].attrs.text
		}))
	}

	addNeuron(e, neuronCount){
		var neuralLayer = e.target.parent
		var color = ""
		var tempNeurons = [...this.state.neurons]

		this.setState(state => ({
			totalNumberOfNeurons:state.totalNumberOfNeurons+1
		}))
		tempNeurons.push({$TYPE:this.state.currentAccordionItemType, _base_type:this.state.baseType, 
			id:"neuron-"+this.state.totalNumberOfNeurons, weight:Math.random() * (10) - 5, dependencies:[], layerId:neuralLayer.children[0].attrs.id})
		this.setState(state => ({
			neurons:tempNeurons
		}))
		switch(this.state.baseType){
			case "input":
				color = "#10B981";
			break;

			case "middle":
				color = "#0EA5E9";
			break;

			case "output":
				color = "#4F46E5"
			break;
			default:
			color=""
		}
		var y = neuronCount !== 0?-neuronCount * 60:-5
		var neuron = this.neuronRef.current.clone({opacity:1, X:40, offsetY:y})
		neuron.children[0].attrs.fill = color
		neuron.children[0].on('click', this.clickOnNeuron)
		neuron.children[1].text(this.state.currentAccordionItemType)
		neuron.children[2].text("id: " + this.state.totalNumberOfNeurons)
		neuralLayer.add(neuron)
	}

	setBaseType(type){
		this.setState(state => ({
			baseType:type
		}))
	}

	zoom(e){
		var scale = this.state.layerScaleX
		if(e.evt.deltaY < 0){
			scale *= 1.01
		}else{
			    scale /= 1.01
		}
		this.setState(state => ({
			layerScaleX: scale
		}) )
	}

	//Rename this
	onBoxDragStart(e){
		if(e.target.hasName("neuralLayer") && !e.target.hasName("sidePane")){
			var pos = this.stageRef.current.getPointerPosition()
			this.setState(state => ({
				selectorBoxX:pos.x,
				selectorBoxY:pos.y,
				isDragging: true
			}))
		}
		this.highlightAndSelectNeuron(e)
		if(e.target.hasName("layer") && this.state.selectedNeurons.length > 0){
			this.state.selectedNeurons.forEach((item) => item.children[0].setStroke("white"))
		}
	}

	onBoxDragEnd(e){
		this.setState(state => ({
			isDragging:false,
			dragBoxWidth:0,
			dragBoxHeight:0
		}))
	}

	onBoxMove(e){
		if(this.state.isDragging){
			var currentPos = this.stageRef.current.getPointerPosition()
			var width = currentPos.x - this.state.selectorBoxX 
			var height = currentPos.y - this.state.selectorBoxY
			this.setState(state => ({
				dragBoxWidth:width,
				dragBoxHeight:height
			}))
			this.highlightAndSelectNeuron(e)
		}
	}

	highlightAndSelectNeuron(e){
		if(e.target.hasName("neuron")){
			e.target.attrs.stroke="#0284C7"
			e.target.attrs.strokeWidth=5
			var obj = e.target.parent;
			var temp = [...this.state.selectedNeurons]
			if(!temp.includes(obj)){
				temp.push(obj)
			}
			this.setState(state => ({
				selectedNeurons:temp
			}))
		}
	}

	clickOnNeuron(e){
		if(this.state.isShiftSelecting === true){
			if(e.target.hasName("neuron")){
				e.target.attrs.stroke="#0284C7"
				e.target.attrs.strokeWidth=5
				var obj = e.target.parent;
				var temp = [...this.state.selectedNeurons]
				if(!temp.includes(obj)){
					temp.push(obj)
				}
				this.setState(state => ({
					selectedNeurons:temp
				}), () => console.log(this.state.selectedNeurons))
			}
		}
		else if (e.target.hasName("neuron")){
				this.state.selectedNeurons.forEach((item) => {
					if(item._id !== e.target.parent._id)
						item.children[0].setStroke("white")}
					)
				e.target.attrs.stroke="#0284C7"
				e.target.attrs.strokeWidth=5
				var neuron = e.target.parent;
				var array = []
				array.push(neuron)
				this.setState(state => ({
					selectedNeurons:array
				}), () => console.log(this.state.selectedNeurons))

		}
	}

	handleKeyPress(e){
		var array = this.state.selectedNeurons
		if(e.code === "Delete"){
			array.forEach((item,array) => item.destroy())
			array.length = 0
		}else if(e.key === "Shift")
			this.setState( state => ({
				isShiftSelecting: true
			}))

		this.setState(state => ({
			selectedNeurons:array
		}))
	}


	onKeyUp(e){
		if(e.key === "Shift"){
			this.setState(state => ({
				isShiftSelecting:false
			}))
		}
	}

	componentDidMount(){
		var container = this.stageRef.current.container()
		container.tabIndex = 1;
		container.focus()
		container.addEventListener('keydown', this.handleKeyPress)
		container.addEventListener('keyup', this.onKeyUp)
	}

	render(){
		//Zoom in works, dragging works. Displaying Neurons works but need to implement Simmodel upload
		var sidePane = <SidePane inputNeurons={Simmodel.inputNeurons} middleNeurons={Simmodel.activators} outputNeurons={Simmodel.outputNeurons} 
		onAccordionItemSelect={this.onAccordionItemSelect} setBaseType={this.setBaseType} currentSelected={this.state.currentAccordionItemType}/>
		var selectorBox = this.state.isDragging?<Rect x={this.state.selectorBoxX} y={this.state.selectorBoxY}
		height={this.state.dragBoxHeight} stroke="#D1D5DB" width={this.state.dragBoxWidth} />:null
		var neuralLayers = this.state.nLayers.map((item, index) => <NeuralLayer offsetX={(index+1) * -350} offsetY={-100} totalNumberOfNeurons={this.state.totalNumberOfNeurons} type={item.type} 
			addNeuron={this.addNeuron} currentSelected={this.state.currentAccordionItemType} baseType={this.state.baseType}/>)
		return(
			<Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={this.onBoxDragStart} onMouseUp={this.onBoxDragEnd} ref={this.stageRef} onMouseMove={this.onBoxMove}>
				<Layer draggable={!this.state.isDragging} onWheel={this.zoom} scaleX={this.state.layerScaleX} scaleY={this.state.layerScaleX}>
				<Group ref={this.neuronRef}>
					<Rect height={50} width={130} stroke="white" cornerRadius={5} opacity={0.40} name="neuron"/>
					<Text wrap="char" width={130} fill="white" listening={false} offsetX={-20} offsetY={-15} />
					<Text wrap="char" width={130} fill="white" listening={false} offsetX={-20} offsetY={-25} />
				</Group>
					<Group>
						<Rect width={window.innerWidth * 4} height={window.innerHeight * 4} x={0} y={0} cornerRadius={5} opacity={0.05} name="layer" fill="gray"/>
						{neuralLayers}
					</Group>
				</Layer>
				<Layer>
					{sidePane}
				</Layer>
				<Layer>
					{selectorBox}
				</Layer>
			</Stage>
			)
	}
}

export default Test;