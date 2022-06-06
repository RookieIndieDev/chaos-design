import '../index.css'
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva'
import { useLocation } from 'react-router-dom'
import React from "react";
import SidePane from './Sidepane/SidePane'
import NeuralLayer from './NeuralLayer/NeuralLayer'
import FullyConnectButton from './FullyConnectButton/FullyConnectButton'
import AddMiddleLayer from './AddMiddleLayer/AddMiddleLayer'
import NeuronInfo from './NeuronInfo/NeuronInfo'
import CopyNeuron from './CopyNeuron/CopyNeuron'
import ExportButton from './ExportButton/ExportButton'

export function withRouter(Children){
	return(props)=>{
		const location = useLocation()
		return <Children {...props} location={location} />
	}
}

class Main extends React.Component
{
	constructor(props){
		super(props);
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
			currentAccordionItemId:"",
			baseType:"",
			lastLayerId:2,
			selectedNeurons:[],
			isShiftSelecting:false,
			ctrlC:false,
			copyNeuronX:0,
			copyNeuronY:0,
			nLayers:[{
				type:"input",
				neuronCount:0,
				id:0
			},{
				type:"output",
				neuronCount:0,
				id:1
			}],
			connections:[],
			rightClickedNeuron:"",
			rightClickedNeuronKeys:[],
			selectedConnections:[],
			simmodel:{}
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
		this.onNeuronRightClick = this.onNeuronRightClick.bind(this)
		this.closeInfo = this.closeInfo.bind(this)
		this.connectionOnClick = this.connectionOnClick.bind(this)
		this.addCopiedNeurons = this.addCopiedNeurons.bind(this)
		this.updateNeuralInfo = this.updateNeuralInfo.bind(this)
		this.updateNeurons = this.updateNeurons.bind(this)
		this.getCurrentNeurons = this.getCurrentNeurons.bind(this)
		this.convertToJSON = this.convertToJSON.bind(this)
		this.initializeWithNNet = this.initializeWithNNet.bind(this)
		this.stageRef = React.createRef()
		this.neuronRef = React.createRef()
	}

	onAccordionItemSelect(e,id){
		this.setState( state => ({
			currentAccordionItemType:e.target.parent.children[1].attrs.text,
			currentAccordionItemId:id
		}))
	}

	convertToJSON(){
		var output = {
			neurons:this.state.neurons
		}
		const blob = new Blob([JSON.stringify(output)], {type:"application/json"})
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.download = 'NNet.json';
		link.href = url;
		link.click();
	}

	addNeuron(e){
		let neuralLayer = e.target.parent
		var color = ""
		var tempNeurons = [...this.state.neurons]
		let allLayers = [...this.state.nLayers]
		let neuronCount = allLayers.find((element,index) => index === neuralLayer.attrs.id).neuronCount
		this.updateNeuralInfo(neuralLayer)

		tempNeurons.push({$TYPE:this.state.currentAccordionItemType, _base_type:this.state.baseType, 
			id:"neuron-"+this.state.totalNumberOfNeurons, dependencies:[], layerId:neuralLayer.attrs.id})
		this.setState(state => ({
			neurons:tempNeurons
		}))
		
		color = this.setNeuronColor(this.state.baseType)
		var y = neuronCount !== 0?-neuronCount * 60:-5
		var neuron = this.neuronRef.current.clone({opacity:1, offsetX:-40, offsetY:y})
		neuron.children[0].attrs.fill = color
		neuron.attrs.baseType = this.state.baseType+"neuron"
		neuron.children[0].on('click', this.clickOnNeuron)
		neuron.children[0].on('contextmenu', this.onNeuronRightClick)
		neuron.children[1].text(this.state.currentAccordionItemType)
		neuron.children[2].text("id: neuron-"+this.state.totalNumberOfNeurons)
		neuron.children[0].attrs.id = "neuron-"+this.state.totalNumberOfNeurons	
		switch(this.state.baseType){
			case "input":
				neuron.attrs.keys = Object.keys(this.state.simmodel.inputNeurons.find(neuron => neuron.$TYPE === this.state.currentAccordionItemType)).filter(key => key !== "$TYPE" && key !== "$DEFAULT")
				break;
			case "output":
				neuron.attrs.keys = Object.keys(this.state.simmodel.outputNeurons.find(neuron => neuron.$TYPE === this.state.currentAccordionItemType)).filter(key => key !== "$TYPE" && key !== "$DEFAULT")
				break;
			default:
				break;
		}
		neuralLayer.add(neuron)
	}

	addCopiedNeurons(e){
		let neurons = [...this.state.neurons]
		let selectedNeurons = [...this.state.selectedNeurons]
		let temp = []
		let neuralLayer = e.target.parent
		let allLayers = [...this.state.nLayers]
		selectedNeurons.forEach(select => {
			neurons.forEach(neuron => {
				if(select === "id: " + neuron.id)
					temp.push(neuron)
			})
		})
		temp.forEach(select => {
			if(select._base_type === e.target.attrs.baseType){
				let neuronCount = allLayers.find((element,index) => index === neuralLayer.attrs.id).neuronCount
				let y = neuronCount !== 0?-neuronCount * 60:-5
				this.updateNeuralInfo(neuralLayer)
				let neuron = this.neuronRef.current.clone({opacity:1, offsetX:-40, offsetY:y})
				neuron.children[0].attrs.fill = this.setNeuronColor(select._base_type)
				neuron.attrs.baseType = select._base_type+"neuron"
				neuron.children[0].on('click', this.clickOnNeuron)
				neuron.children[0].on('contextmenu', this.onNeuronRightClick)
				neuron.children[1].text(select.$TYPE)
				neuron.children[2].text("id: neuron-"+this.state.totalNumberOfNeurons)
				neuron.children[0].attrs.id = "neuron-"+this.state.totalNumberOfNeurons
				switch(select._base_type){
					case "input":
						neuron.attrs.keys = Object.keys(this.state.simmodel.inputNeurons.find(neuron => neuron.$TYPE === select.$TYPE)).filter(key => key !== "$TYPE" && key !== "$DEFAULT")
						break;
					case "output":
						neuron.attrs.keys = Object.keys(this.state.simmodel.outputNeurons.find(neuron => neuron.$TYPE === select.$TYPE)).filter(key => key !== "$TYPE" && key !== "$DEFAULT")
						break;
					default:
						break;
				}
				neuralLayer.add(neuron)
				neurons.push({
					$TYPE:select.$TYPE, _base_type:select._base_type, 
					id:"neuron-"+this.state.totalNumberOfNeurons, dependencies:[], layerId:neuralLayer.attrs.id
				})
			}
		})

		this.setState(state => ({
			neurons:neurons
		}))
	}

	updateNeuralInfo(neuralLayer){
		let allLayers = [...this.state.nLayers]
		allLayers.find((element,index) => index === neuralLayer.attrs.id).neuronCount += 1
		this.setState(state => ({
			totalNumberOfNeurons:state.totalNumberOfNeurons+1
		}))
		this.setState(state => ({
			nLayers:allLayers
		}))
	}

	getCurrentNeurons(){
		return [...this.state.neurons]
	}

	updateNeurons(tempNeurons){
		this.setState( state => ({
			neurons:tempNeurons
		}))
	}

	setNeuronColor(baseType){
		let color=""
		switch(baseType){
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
		return color
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
		if(e.evt.button === 0){
			if((e.target.hasName("neuralLayer") && !e.target.hasName("sidePane")) || e.target.hasName("connection")){
				var pos = this.stageRef.current.getPointerPosition()
				this.setState(state => ({
					selectorBoxX:pos.x,
					selectorBoxY:pos.y,
					isDragging: true
				}))
			}
			this.highlightAndSelectNeuron(e)
			if(e.target.hasName("layer")){
				if(this.state.selectedNeurons.length > 0){
					let tempNeurons = this.stageRef.current.find(node => node.attrs.name==="neuron")
					tempNeurons.forEach(neuron => {
						if(neuron.attrs.id !== "ignore"){
							neuron.setStroke("white")
						}
					})
					let selectNeurons = [...this.state.selectedNeurons]
					selectNeurons.length = 0
					this.setState(state => ({
						selectedNeurons:selectNeurons
					}))
				}else{
					let connections = this.stageRef.current.find(node => node.attrs.name ==="connection")
					connections.forEach(connection => connection.stroke("#9CA3AF"))
				}
			}
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
			let currentPos = this.stageRef.current.getPointerPosition()
			var width = currentPos.x - this.state.selectorBoxX 
			var height = currentPos.y - this.state.selectorBoxY
			this.setState(state => ({
				dragBoxWidth:width,
				dragBoxHeight:height
			}))
			this.highlightAndSelectNeuron(e)
			this.connectionOnClick(e)
		}else if(this.state.ctrlC){
			let currentPos = this.stageRef.current.getPointerPosition()
			this.setState(state => ({
				copyNeuronX:currentPos.x,
				copyNeuronY:currentPos.y
			}))
		}
	}

	highlightAndSelectNeuron(e){
		if(e.target.hasName("neuron")){
			e.target.attrs.stroke="#0284C7"
			e.target.attrs.strokeWidth=5
			var obj = e.target.parent;
			var temp = [...this.state.selectedNeurons]
			if(!temp.includes(obj.children[2].attrs.text)){
				temp.push(obj.children[2].attrs.text)
			}
			this.setState(state => ({
				selectedNeurons:temp
			}))
		}
	}

	clickOnNeuron(e){
		let tempNeurons = []
		if(e.evt.button === 0){
			if(this.state.isShiftSelecting === true){
				if(e.target.hasName("neuron")){
					e.target.attrs.stroke="#0284C7"
					e.target.attrs.strokeWidth=5
					var obj = e.target.parent;
					var temp = [...this.state.selectedNeurons]
					if(!temp.includes(obj.children[2].attrs.text)){
						temp.push(obj.children[2].attrs.text)
					}
					this.setState(state => ({
						selectedNeurons:temp
					}))
				}
			}
			else if (e.target.hasName("neuron")){
						tempNeurons = this.stageRef.current.find(node => node.attrs.name==="neuron")
						tempNeurons.forEach(neuron => {
							if(neuron.attrs.id !== "ignore" && neuron._id !== e.target._id){
								neuron.setStroke("white")
							}
						})
						e.target.attrs.stroke="#0284C7"
						e.target.attrs.strokeWidth=5
						var neuron = e.target.parent;
						var array = []
						array.push(neuron.children[2].attrs.text)
						this.setState(state => ({
							selectedNeurons:array
						}))
			}
		}
	}

	onNeuronRightClick(e){
		e.evt.preventDefault()
		if(e.target.hasName("neuron")){
			this.setState(state => ({rightClickedNeuron:e.target.parent.children[2].attrs.text,
				rightClickedNeuronKeys:e.target.parent.attrs.keys
			}))
		}
	}

	handleKeyPress(e){
		let selectNeurons = [...this.state.selectedNeurons]
		let allNeurons = [...this.state.neurons]
		let nLayers = [...this.state.nLayers]
		let allConnections = [...this.state.connections]
		let removedNeurons = []
		let prevLayer
		let nextLayer

		if(e.code === "Delete"){
			if(this.state.selectedConnections.length === 0){
					this.setState(state => ({
							totalNumberOfNeurons:state.totalNumberOfNeurons === selectNeurons.length?0:state.totalNumberOfNeurons-selectNeurons.length
					}))
					allConnections.length = 0
					this.setState(state => ({connections: allConnections}))
					selectNeurons.forEach((item) =>{
						allNeurons.forEach((neuron, index, neurons) =>{
							if(neuron.id === item.split("id: ")[1]){
								nLayers.forEach(layer => {
									if(neuron.layerId === layer.id){
										layer.neuronCount -= 1
									}
								})
								removedNeurons = neurons.splice(neurons.indexOf(neuron), 1)
								let toDelete = this.stageRef.current.find(node => node.attrs.text === item)
								let parent = toDelete[0].parent.parent
								toDelete.forEach(del => del.parent.destroy())
								toDelete.forEach(del => parent.children.forEach((toMove,index) => {
									if(index !== 0){
										toMove.offsetY(index === 1?-5:-60*(index-1))
									}
								}))
							}
						})
					})
				nLayers.forEach(layer => {
					if(layer.type === "input"){
						prevLayer = this.stageRef.current.find(node => {
							return node.attrs.id === layer.id
						})
						nextLayer = this.stageRef.current.find(node => {
							return node.attrs.id === layer.id+1
						})
					}else{
						prevLayer = this.stageRef.current.find(node => {
							return node.attrs.id === layer.id-1
						})
						nextLayer = this.stageRef.current.find(node => {
							return node.attrs.id === layer.id
						})
					}
					if(nextLayer[0] !== undefined){
						let dependencies = []
						let neurons = []
						prevLayer[0].children.forEach(item => {
							if(item.attrs.name !== "neuralLayer"){
								let dependency = {}
								dependency.neuronId = item.children[2].attrs.text.split(": ")[1]
								dependency.weight = this.Gaussian()
								dependencies.push(dependency)
							}
						})
						nextLayer[0].children.forEach(item => {
							if(item.attrs.name !== "neuralLayer"){
								let neuron = {}
								neuron.neuronId = item.children[2].attrs.text.split(": ")[1]
								neurons.push(neuron)
							}
						})
						prevLayer[0].children.forEach(dep => {
							if(dep.attrs.name !== "neuralLayer"){
								nextLayer[0].children.forEach(neuron => {
									if(neuron.attrs.name !== "neuralLayer"){
										this.makeConnection(dep, neuron)
									}
								})
							}
						})
						this.fullyConnectLayers(dependencies, neurons)
					}
				})
				selectNeurons.length = 0
				removedNeurons.forEach(removedNeuron => {
					allNeurons.forEach(neuron => {
						neuron.dependencies.forEach((dep, depIndex, dependencies) => {
							if(dep.neuronId === removedNeuron.id){
								dependencies.splice(depIndex, 1)
							}
						})
					})
				})
			}

			let selectedConns = [...this.state.selectedConnections]
			let removedConns = []
			let tempConns = [...this.state.connections]
			selectedConns.forEach((conn, index, connections) => 
				{
					let connsToDelete = this.stageRef.current.find(node => node.attrs.id === conn)
					connsToDelete.forEach(del => {
						removedConns.push(del)
						del.destroy()
					})
					tempConns.forEach((conn, index, array) => {
						removedConns.forEach(remove => {
							if(remove.attrs.targetId === conn.targetId && remove.attrs.sourceId === conn.sourceId)
								array.splice(array.indexOf(conn), 1)
						})
					})
				})
				this.setState(state => ({
					connections:tempConns
				}))
				selectedConns.length = 0
				this.setState(state => ({
					selectedConnections:selectedConns
				}))
		}else if(e.key === "Shift"){
			this.setState( state => ({
				isShiftSelecting: true
			}))	
		}else if(e.ctrlKey && e.key === "c"){
			this.setState(state => ({
				ctrlC:true,
				copyNeuronX:this.stageRef.current.getPointerPosition().x,
				copyNeuronY:this.stageRef.current.getPointerPosition().y
			}))
		}else if (e.key === "Escape"){
			this.setState(state => ({
				ctrlC:false
			}))
		}
		
		this.setState(state => ({
			neurons:allNeurons
		}))
		this.setState(state => ({
			selectedNeurons:selectNeurons
		}))
		this.setState(state => ({
			nLayers:nLayers
		}))
	}

	closeInfo(){
		this.setState(state => ({
			rightClickedNeuron:"",
			rightClickedNeuronKeys:[]
		}))
	}

	onKeyUp(e){
		if(e.key === "Shift"){
			this.setState(state => ({
				isShiftSelecting:false
			}))
		}
	}

	addMiddleLayer(){
		let layers = [...this.state.nLayers]
		let neurons = [...this.state.neurons]
		layers.splice(layers.length - 1, 0, {
			type:"middle",
			neuronCount:0
		})
		layers.forEach((item, index) => {item.id = index
		})
		this.setState(
			state => ({
				nLayers:layers,
				neurons:neurons
		}))
		let outputGroup = this.stageRef.current.find(node => node.attrs.id === layers.length-1)[0]
		let outputNeurons = this.stageRef.current.find(node => node.attrs.baseType === "outputneuron")
		outputNeurons.forEach(item => {
			outputGroup.add(item)
		})
	}


	fullyConnectLayers(dependencies){
		let currentNeurons = [...this.state.neurons]
		for(let i = 0; i < dependencies.length; i++){
				for(let j = 0; j < currentNeurons.length; j++){
					if(currentNeurons[j].id === dependencies[i].targetId && currentNeurons[j].dependencies.find(dep => dep.neuronId === dependencies[i].neuronId) === undefined){
							currentNeurons[j].dependencies.push(dependencies[i])
						}
					}
				}
		this.setState(state => ({neurons: currentNeurons}))
	}
		
	makeConnection(dep, neuron){
		this.setState(state => ({
			layerScaleX:1
		}))
		this.stageRef.current.children[0].x(0)
		this.stageRef.current.children[0].y(0)
		let sourceId = dep.children[2].attrs.text.split("id: ")[1]
		let targetId = neuron.children[2].attrs.text.split("id: ")[1]
		let temp = [...this.state.connections]
		let depRect=dep.getClientRect()
		let neuronRect = neuron.getClientRect()
		let X = depRect.x - neuronRect.x
		let Y = depRect.y - neuronRect.y
		let connection = {
			x:depRect.x,
			y:depRect.y+depRect.height/2,
			points:[125, 0, -X, -Y],
			sourceId:sourceId,
			targetId:targetId
		}
		temp.push(connection)
		this.setState(state => ({
			connections:temp
		}))

	}

	connectionOnClick(e){
		let connIds = [...this.state.selectedConnections]
		if(e.evt.button === 0 && this.state.selectedNeurons.length === 0){
			if(this.state.isShiftSelecting === true || this.state.isDragging === true){
				if(e.target.hasName("connection")){
					connIds.push(e.target.attrs.id)	
					e.target.stroke("#06B6D4")
				}
			}
			else{
				connIds = [e.target.attrs.id]
				let connections = this.stageRef.current.find( node => node.attrs.name ==="connection")
				connections.forEach(connection => {
					if(connection.attrs.id !== e.target.attrs.id){
						connection.stroke("#9CA3AF")
					}
				})
				e.target.stroke("#06B6D4")
			}
		}
		this.setState(state => ({
			selectedConnections:connIds
		}))
	}

	initializeWithNNet(nNet){
			let neuronCounts = []
			let allLayers = [...this.state.nLayers]
			let connections = []
			let currNeuron = {}
			this.setState(state => ({
				neurons:nNet,
				totalNumberOfNeurons:nNet.length+1
			}), () => {
				this.state.neurons.forEach(neuron => {
					if(neuronCounts[neuron.layerId] === undefined)
						neuronCounts.push(1)
					else
						neuronCounts[neuron.layerId]++

				})

				neuronCounts.forEach((count, index) => {
					if(index !== 0 && index !== neuronCounts.length-1){
						allLayers.splice(allLayers.length - 1, 0, {
							type:"middle",
							neuronCount:count
						})
					}
				})

				this.setState(state => ({
					nLayers:allLayers
				}), () => {
					allLayers.forEach((item, index, layers) => {
						let layerNeurons = []
						item.id = index;
						this.state.neurons.forEach(neuron => {
							if(item.id === neuron.layerId){
								layerNeurons.push(neuron)
								let neuralLayer = this.stageRef.current.find(node => node.attrs.id === neuron.layerId)[0]

								if(item.type !== "middle"){
									item.neuronCount += 1
								}
								var y = item.neuronCount !== 1?-(layerNeurons.indexOf(neuron) * 60):-5
								let color = this.setNeuronColor(neuron._base_type)
								let neuronClone = this.neuronRef.current.clone({opacity:1, offsetX:-40, offsetY:y})
								neuronClone.children[0].attrs.fill = color
								neuronClone.attrs.baseType = neuron._base_type+"neuron"
								neuronClone.children[0].on('click', this.clickOnNeuron)
								neuronClone.children[0].on('contextmenu', this.onNeuronRightClick)
								neuronClone.children[1].text(neuron.$TYPE)
								neuronClone.children[2].text("id: " +  neuron.id)
								neuronClone.children[0].attrs.id = neuron.id
								switch(neuron._base_type){
									case "input":
										neuronClone.attrs.keys = Object.keys(this.state.simmodel.inputNeurons.find(sim => sim.$TYPE === neuron.$TYPE)).filter(key => key !== "$TYPE" && key !== "$DEFAULT")
										break;
									case "output":
										neuronClone.attrs.keys = Object.keys(this.state.simmodel.outputNeurons.find(sim => sim.$TYPE === neuron.$TYPE)).filter(key => key !== "$TYPE" && key !== "$DEFAULT")
										break;
									default:
										break;
								}
								neuralLayer.add(neuronClone)
							}
						})
					})
					this.setState( state => ({
						nLayers:allLayers
					}))
					try{
						this.state.neurons.forEach(neuron => {
							if(neuron._base_type !== "input"){
								currNeuron = neuron
								let target = this.stageRef.current.find(node => node.hasName("neuron") && node.attrs.id === neuron.id)[0]
								neuron.dependencies.forEach(dep => {
									var depRect = this.stageRef.current.find(node => node.attrs.id === dep.neuronId)[0].getClientRect()
									var targetRect = target.getClientRect()
									let X = depRect.x - targetRect.x
									let Y = depRect.y - targetRect.y
									let connection = {
										x:depRect.x,
										y:depRect.y+depRect.height/2,
										points:[125, 0, -X, -Y],
										sourceId:dep.neuronId,
										targetId:neuron.id
									}
									connections.push(connection)
									this.setState(state => ({
										connections:connections
									}))
								})
							}
						})
					}
					catch(error){
						console.log(error)
						console.log(currNeuron)
					}
				})
			})
	}

	componentDidMount(){
		let simmodel = this.props.location.state.simmodel
		if(this.props.location.state.nNet)
			this.initializeWithNNet(this.props.location.state.nNet.neurons)
		this.setState(state => ({simmodel:simmodel}))
		var container = this.stageRef.current.container()
		container.tabIndex = 1;
		container.focus()
		container.addEventListener('keydown', this.handleKeyPress)
		container.addEventListener('keyup', this.onKeyUp)
		document.title="Editor"
	}

	Gaussian(){
		var u1 = 1.0 - Math.random()
    	var u2 = 1.0 - Math.random
        return Math.Sqrt(-2.0 * Math.Log(u1)) * Math.Sin(2.0 * Math.PI * u2);
	}

	render(){
		let sidePane = <SidePane inputNeurons={this.state.simmodel.inputNeurons} middleNeurons={this.state.simmodel.activators} outputNeurons={this.state.simmodel.outputNeurons} 
		onAccordionItemSelect={this.onAccordionItemSelect} setBaseType={this.setBaseType} currentSelected={this.state.currentAccordionItemId}/>
		let selectorBox = this.state.isDragging?<Rect x={this.state.selectorBoxX} y={this.state.selectorBoxY}
		height={this.state.dragBoxHeight} stroke="#D1D5DB" width={this.state.dragBoxWidth} />:null
		let neuralLayers = this.state.nLayers.map((item, index) => <NeuralLayer offsetX={(index+1) * -350} offsetY={-100} type={item.type} 
			addNeuron={this.addNeuron} addCopiedNeurons={this.addCopiedNeurons} neuronCount={item.neuronCount} copied={this.state.ctrlC} currentSelected={this.state.currentAccordionItemType} baseType={this.state.baseType} 
			layerId={index} key={index.toString()}/>)	
		let fullyConnectButtons = this.state.nLayers.map((item, index) => {
				if(item.type !== "output")
					return <FullyConnectButton offsetX={-(610 + ((index) * 350))} sourceLayerIndex={index} targetLayerIndex={index+1} fullyConnectLayers={this.fullyConnectLayers} makeConnection={this.makeConnection} key={index.toString()}/>
				else
					return null
				}
			)
		let connections = this.state.connections.map((item, index) => <Line stroke="#9CA3AF" x={item.x} y={item.y} points={item.points} strokeWidth={5.5} 
			sourceId={item.sourceId} targetId={item.targetId} id={"connId: " + index} onClick={this.connectionOnClick} name="connection"
			onMouseEnter={(e) => e.target.strokeWidth(10)} onMouseLeave={(e) => e.target.strokeWidth(5.5)} lineCap="round" key={index.toString()}/>)
		let infoScreen = this.state.rightClickedNeuron !== "" && this.state.rightClickedNeuronKeys !== undefined?<Layer><NeuronInfo selected={this.state.rightClickedNeuron} 
		keys={this.state.rightClickedNeuronKeys} close={this.closeInfo} getCurrentNeurons={this.getCurrentNeurons} updateNeurons={this.updateNeurons}/></Layer>:null
		let copyNeuron = this.state.ctrlC && this.state.selectedNeurons.length > 0?<Layer><CopyNeuron X={this.state.copyNeuronX} Y={this.state.copyNeuronY} count={this.state.selectedNeurons.length}/></Layer>:null
		let exportButton = this.state.totalNumberOfNeurons > 0?<ExportButton export={this.convertToJSON}/>:null
		return(
			<Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={this.onBoxDragStart} onMouseUp={this.onBoxDragEnd} ref={this.stageRef} onMouseMove={this.onBoxMove}>
				<Layer draggable={!this.state.isDragging} onWheel={this.zoom} scaleX={this.state.layerScaleX} scaleY={this.state.layerScaleX}>
				<Group ref={this.neuronRef}>
					<Rect height={50} width={130} stroke="white" cornerRadius={5} opacity={0.40} name="neuron" id="ignore"/>
					<Text wrap="none" fill="white" listening={false} offsetX={-20} offsetY={-15} width={50} ellipsis={true}/>
					<Text wrap="char" width={130} fill="white" listening={false} offsetX={-20} offsetY={-25}/>
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
					{exportButton}
				</Layer>
				{infoScreen}
				{copyNeuron}
			</Stage>
			)
	}
}

export default withRouter(Main);