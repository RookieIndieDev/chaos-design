import '../../index.css';
import { Stage, Layer, Rect, Text, Group, Circle, Line } from 'react-konva';
import React from "react";
import SidePane from './Sidepane/SidePane.js'
import NeuralLayer from './NeuralLayer/NeuralLayer.js'
import Simmodel from '../../chaosnet/terrariaSimmodel.json'
import FullyConnectButton from './FullyConnectButton/FullyConnectButton.js'
import AddMiddleLayer from './AddMiddleLayer/AddMiddleLayer.js'

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
			neurons:[],
			totalNumberOfNeurons:0,
			currentAccordionItemType:"",
			baseType:"",
			lastLayerId:2,
			selectedNeurons:[],
			isShiftSelecting:false,
			nLayers:[{
				type:"input",
				neuronCount:0
			},{
				type:"output",
				neuronCount:0
			}],
			connections:[]
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
		this.addMiddleLayer = this.addMiddleLayer.bind(this)
		this.fullyConnectLayers = this.fullyConnectLayers.bind(this)
		this.makeConnection = this.makeConnection.bind(this)
		this.stageRef = React.createRef()
		this.neuronRef = React.createRef()
	}

	onAccordionItemSelect(e){
		this.setState( state => ({
			currentAccordionItemType:e.target.parent.children[1].attrs.text
		}))
	}

	//Remove weight generation for neurons, only used with something like BiasInput, not for every single neuron type.
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
		}), () => console.log(this.state.neurons))
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
		var neuron = this.neuronRef.current.clone({opacity:1, offsetX:-40, offsetY:y})
		neuron.children[0].attrs.fill = color
		neuron.attrs.baseType = this.state.baseType+"neuron"
		neuron.children[0].on('click', this.clickOnNeuron)
		neuron.children[1].text(this.state.currentAccordionItemType)
		neuron.children[2].text("id: neuron-"+this.state.totalNumberOfNeurons)
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
				}))
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
				}))

		}
	}

	updateNeuralLayeraHeight(){

	}

	handleKeyPress(e){
		let selectNeurons = this.state.selectedNeurons
		let allNeurons = this.state.neurons
		let allConnections = this.state.connections
		if(e.code === "Delete"){
			selectNeurons.forEach((item,array) => {
				allNeurons.forEach((neuron, index, array) => {
					if(item.parent.children[1].children[2].attrs.text.split("id: ")[1] === neuron.id){
						array.splice(array.indexOf(neuron), 1)
					}
				})
				allConnections.forEach((conn, index, array) => {
					if(conn.sourceId === item.parent.children[1].children[2].attrs.text.split("id: ")[1]|| conn.targetId === item.parent.children[1].children[2].attrs.text.split("id: ")[1]){
						array.splice(array.indexOf(conn), 1)
					}
				})
				item.destroy()
			})
			selectNeurons.length = 0
			this.setState(state => ({
				neurons:allNeurons
			}), () => console.log(this.state.neurons))
		}else if(e.key === "Shift")
			this.setState( state => ({
				isShiftSelecting: true
			}))

		this.setState(state => ({
			selectedNeurons:selectNeurons
		}))
	}


	onKeyUp(e){
		if(e.key === "Shift"){
			this.setState(state => ({
				isShiftSelecting:false
			}))
		}
	}


	//Adding middle layers after adding output neurons screws things up somehow. Need to fix
	addMiddleLayer(){
		let layers = [...this.state.nLayers]
		layers.splice(layers.length - 1, 0, {
			type:"middle"
		})
		this.setState(
			state => ({
				nLayers:layers
	}))
	}

	componentDidMount(){
		var container = this.stageRef.current.container()
		container.tabIndex = 1;
		container.focus()
		container.addEventListener('keydown', this.handleKeyPress)
		container.addEventListener('keyup', this.onKeyUp)
	}

	fullyConnectLayers(dependencies, neurons){
		let currentNeurons = [...this.state.neurons]
		for(let i = 0; i < dependencies.length; i++){
			for(let j = 0; j < neurons.length; j++){
				for(let k = 0; k < currentNeurons.length; k++){
					if(currentNeurons[k].id === neurons[j].neuronId && neurons[j] !== undefined){
						if(currentNeurons[k].dependencies.find(dep => dep.neuronId === dependencies[i].neuronId) === undefined){
							currentNeurons[k].dependencies.push(dependencies[i])
						}
					}
				}

			}
		}
		this.setState(state => ({neurons: currentNeurons}))
	}

	makeConnection(dep, neuron){
		let sourceId = dep.parent.children[1].children[2].attrs.text.split("id: ")[1]
		let targetId = neuron.parent.children[1].children[2].attrs.text.split("id: ")[1]
		let temp = [...this.state.connections]
		let depRect=dep.getClientRect()
		let neuronRect = neuron.getClientRect()
		let X = depRect.x - neuronRect.x
		let Y = depRect.y - neuronRect.y
		temp.push({
			x:depRect.x,
			y:depRect.y+depRect.height/2,
			points:[125, 0, -X, -Y],
			sourceId:sourceId,
			targetId:targetId
		})
		this.setState(state => ({
			connections:temp
		}))

	}

	render(){
		//Need to implement Simmodel upload
		let sidePane = <SidePane inputNeurons={Simmodel.inputNeurons} middleNeurons={Simmodel.activators} outputNeurons={Simmodel.outputNeurons} 
		onAccordionItemSelect={this.onAccordionItemSelect} setBaseType={this.setBaseType} currentSelected={this.state.currentAccordionItemType}/>
		let selectorBox = this.state.isDragging?<Rect x={this.state.selectorBoxX} y={this.state.selectorBoxY}
		height={this.state.dragBoxHeight} stroke="#D1D5DB" width={this.state.dragBoxWidth} />:null
		let neuralLayers = this.state.nLayers.map((item, index) => <NeuralLayer offsetX={(index+1) * -350} offsetY={-100} totalNumberOfNeurons={this.state.totalNumberOfNeurons} type={item.type} 
			addNeuron={this.addNeuron} currentSelected={this.state.currentAccordionItemType} baseType={this.state.baseType} id={index}/>)		
		let fullyConnectButtons = this.state.nLayers.map((item, index) => {
				if(item.type !== "output")
					return <FullyConnectButton offsetX={-(610 + ((index) * 350))} sourceLayerIndex={index} targetLayerIndex={index+1} fullyConnectLayers={this.fullyConnectLayers} makeConnection={this.makeConnection}/>}
			)
		let connections = this.state.connections.map((item, index) => <Line stroke="#9CA3AF" x={item.x} y={item.y} points={item.points} strokeWidth={5}/>)
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
						{fullyConnectButtons}
						{connections}
					</Group>
				</Layer>
				<Layer>
					{sidePane}
				</Layer>
				<Layer>
					{selectorBox}
				</Layer>
				<Layer>
					<AddMiddleLayer addMiddleLayer={this.addMiddleLayer}/>
				</Layer>
			</Stage>
			)
	}
}

export default Test;