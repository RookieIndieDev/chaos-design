import '../index.css';
import { Stage, Layer, Rect, Text, Group, Circle, Line } from 'react-konva';
import React from "react";
import SidePane from './SidePane.js'
import simmodel from '../chaosnet/chaoscraftDiscoverySimmodel.json'
import NeuralLayer from './NeuralLayer.js'
import AddMiddleLayerBtn from './AddMiddleLayerBtn.js'

class Main extends React.Component
{

	constructor(){
		super();
		this.onNeuralLayerClick = this.onNeuralLayerClick.bind(this);
		this.onNeuronSelect = this.onNeuronSelect.bind(this);
		this.onAddNeuralLayer = this.onAddNeuralLayer.bind(this);
		this.getCurrentLayerNeuronCount = this.getCurrentLayerNeuronCount.bind(this);
		this.onScroll = this.onScroll.bind(this);
		this.onConnectorClick = this.onConnectorClick.bind(this);
		this.onNeuronClick = this.onNeuronClick.bind(this);
		this.onStageRightClick = this.onStageRightClick.bind(this);
		this.shapeRef = React.createRef();
		this.stageRef = React.createRef();
		this.layerRef = React.createRef();
		this.textRef = React.createRef();
		this.groupRef = React.createRef();
		this.neuralLayerGroup = React.createRef();
		this.neuralShape = React.createRef();
		this.circleRef = React.createRef();		
		this.lineRef = React.createRef();
		this.simmodel = {simmodel}
		this.line = null
		this.simmodelNeurons = simmodel.inputNeurons.concat(simmodel.activators.concat(simmodel.outputNeurons)) 
		this.state = {
			currentNeuronId:0,
			currentNeuron:"",
			currentLayerNeuronCount:0,
			totalNumberOfNeurons:0,
			numberOfMiddleLayers:0,
			neurons:[],
			middleLayers:[],
			connections:[],
			weights:[],
			dependencyNeuron:null,
			baseType:"",
			scaleAmount:1,
			selectedNeuronId:"",
			connectorX:0,
			connectorY:0,
			isConnecting:false,
			rectX:0,
			rectY:0,
			source:null,
			target:null
		}
	}

	componentDidMount(){
		//console.log(this.simmodelNeurons)
	}

	onNeuralLayerClick(e){
		var color = "";
		let temp;
		let keys;
		let circleTwo;

		if(this.state.currentNeuron && this.state.baseType === e.target.attrs.id && this.state.isConnecting === false)
		{
			this.setState(state => ({
				totalNumberOfNeurons: state.totalNumberOfNeurons+1
			}))

			switch(this.state.baseType){
				case "input":
					color = "#10B981";
					temp = this.simmodelNeurons.find(neuron => neuron.$TYPE === this.state.currentNeuron)
					keys = Object.keys(temp).filter(key => key !== "$TYPE" && key !== "$DEFAULT")
					//console.log(keys)
				break;

				case "middle":
					color = "#60A5FA";
					temp = this.simmodelNeurons.find(neuron => neuron === this.state.currentNeuron)
					circleTwo = this.circleRef.current.clone({x:-5, y:25, radius:8, shadowOffsetY:5, shadowColor:"gray", shadowBlur:5, name:"neuronConnector"})
					circleTwo.setAttr("connectFrom", false)
					circleTwo.on("click", this.onConnectorClick)
				break;

				case "output":
					color = "#F87171"
					temp = this.simmodelNeurons.find(neuron => neuron.$TYPE === this.state.currentNeuron)
					keys = Object.keys(temp).filter(key => key !== "$TYPE" && key !== "$DEFAULT")
					circleTwo = this.circleRef.current.clone({x:-5, y:25, radius:8, shadowOffsetY:5, shadowColor:"gray", shadowBlur:5, name:"neuronConnector" })
					circleTwo.setAttr("connectFrom", false)
					circleTwo.on("click", this.onConnectorClick)
					//console.log(keys)
				break;
				default:
				color=""
			}
			var shape = this.shapeRef.current.clone({width: 120, height: 50, fill:color})
			var text = this.textRef.current.clone({align:"center", width:120, height:50, fontSize:10, padding:20, text:this.state.currentNeuron, wrap:"char", ellipsis:true })
			var neuronId = this.textRef.current.clone({align:"center", width:120, height:50, fontSize:10, padding:30, offsetX:5, text:"neuronId: " + this.state.totalNumberOfNeurons, 
				name:"neuron-" + this.state.totalNumberOfNeurons, wrap:"char"})
			var circle = this.circleRef.current.clone({x:120, y:25, radius:8, shadowOffsetY:5, shadowColor:"gray", shadowBlur:5, name:"neuronConnector"})
			circle.on("click", this.onConnectorClick)
			circle.setAttr("connectFrom", true)
			var group = this.groupRef.current.clone({x:e.target.attrs.x , offsetX: -18, offsetY:(- this.state.currentLayerNeuronCount * 60)})

			var neuron = {
				_base_type:this.state.baseType,
				id:"neuron-"+this.state.totalNumberOfNeurons,
				$TYPE:this.state.currentNeuron,
				dependencies:[]
			}
			if(this.state.baseType !== "middle")
				keys.forEach(key => neuron[key] = "default")
			group.add(shape)
			group.add(text)
			group.add(neuronId)
			if(this.state.baseType !== "output")
				group.add(circle)
			group.on("click", this.onNeuronClick)
			if(this.state.baseType === "middle" || this.state.baseType === "output")
				group.add(circleTwo)
			e.target.parent.add(group)
			this.setState({neurons: [...this.state.neurons, neuron]}) 
			this.layerRef.current.batchDraw();
		}
	}

	onAddNeuralLayer(){

		this.setState(state => ({
			numberOfMiddleLayers: state.numberOfMiddleLayers + 1,
			middleLayers: [...state.middleLayers, <NeuralLayer x={250 * (state.middleLayers.length + 1)} stroke="#60A5FA" onClick={this.onNeuralLayerClick} 
			key={this.state.numberOfMiddleLayers} id="middle" baseType="middle" getCurrentLayerNeuronCount={this.getCurrentLayerNeuronCount} isConnecting={this.state.isConnecting} nIndex={this.state.numberOfMiddleLayers + 1}/>]
		}))
	}

	onNeuronSelect(e, type){
		this.setState(state => ({
			currentNeuronId: e.target.id,
			currentNeuron: e.target.textContent,
			baseType:type
		}))
	}

	onScroll(e){
		e.evt.preventDefault()
		this.setState(state =>
			({
				scaleAmount: Math.min(Math.max(0.3, state.scaleAmount + e.evt.deltaY * -0.01), 1)
			}))
		this.layerRef.current.batchDraw()
	}

	getCurrentLayerNeuronCount(count){
		this.setState(state => ({
			currentLayerNeuronCount:count
		}))
	}

	onConnectorClick(e){
		var points;
		var transform = this.layerRef.current.getAbsoluteTransform().copy()
		transform.invert() 
		let pos = transform.point(e.target.getAbsolutePosition())
		if(this.state.isConnecting === true){
			var temp = this.state.neurons.find(neuron => neuron.id === e.target.parent.children[2].attrs.name)
			temp.dependencies = [this.state.dependencyNeuron]
			this.setState(state => ({
				isConnecting:false,
				target:e.target
			}))
			//Checking to see if a neuron is being connected to anbther neuron in the same layer 
			if(this.state.source.parent.parent._id !== this.state.target.parent.parent._id){
				var diff = Math.abs(this.state.source.parent.parent.getAttr("nIndex") - this.state.target.parent.parent.getAttr("nIndex")) //Check to see if the target's layer is the adjacent to the source layer			
				if((diff) === 1){
					points = [this.state.connectorX, this.state.connectorY, pos.x, pos.y]
					this.setState(state => ({
						connections: [...state.connections, <Line points={points} stroke="#6D28D9" strokeWidth={2} lineCap="round" listening={false} key={state.connections.length}/>],
						weights: [...state.weights, this.state.dependencyNeuron.weight]
					}))
				}
			}
		}else if(this.state.isConnecting === false && e.target.attrs.connectFrom === true){
			e.target.stroke("green") 
			e.target.strokeWidth(10)
			this.setState(state => ({
				connectorX: pos.x,
				connectorY: pos.y,
				isConnecting:true,
				source:e.target,
				dependencyNeuron: state.neurons.find(neuron => neuron.id === e.target.parent.children[2].attrs.name)
			}), () => console.log(this.state.dependencyNeuron))
		} 
	}

	onNeuronClick(e){
		if(!e.target.hasName("neuronConnector")){
			this.setState(state => ({
				selectedNeuronId: e.target.attrs.name,
				rectX:e.target.getAbsolutePosition().x + 100,
				rectY:e.target.getAbsolutePosition().y
			}))
		}
	}

	onStageRightClick(e){
		e.evt.preventDefault()
		if(this.state.isConnecting === true && e.evt.button === 2){
			this.setState(state => ({
				isConnecting: false
			}))
		}
	}

	render() {
		return(
			<div className="flex flex-row">
				<SidePane onNeuronSelect={this.onNeuronSelect} currentNeuronId={parseInt(this.state.currentNeuronId)} 
					inputNeurons={simmodel.inputNeurons} outputNeurons={simmodel.outputNeurons} activators={simmodel.activators}
					currentNeuron={this.state.currentNeuron} onAccordionSelect={this.onAccordionSelect}/>
				<Stage width={window.innerWidth} height={window.innerHeight} className="bg-gray-200 overflow-y-hidden overflow-x-hidden" ref={this.stageRef} onWheel={e => this.onScroll(e)} onClick={this.onStageRightClick}>
				  <Layer ref={this.layerRef} scaleX={this.state.scaleAmount} scaleY={this.state.scaleAmount}>
					  <Group ref={this.neuralLayerGroup} x={250} y={50}>
						  <NeuralLayer stroke="#10B981" onClick={this.onNeuralLayerClick} id="input" baseType={this.state.baseType} getCurrentLayerNeuronCount={this.getCurrentLayerNeuronCount} 
						  isConnecting={this.state.isConnecting} nIndex={0}/>
						  {this.state.middleLayers}
						  <NeuralLayer offsetX={-250 * (this.state.middleLayers.length + 1)} stroke="#F87171" onClick={this.onNeuralLayerClick} id="output" baseType={this.state.baseType}
						   getCurrentLayerNeuronCount={this.getCurrentLayerNeuronCount} isConnecting={this.state.isConnecting} nIndex={this.state.numberOfMiddleLayers + 1} />
					  </Group>
					  {this.state.connections}
					  <Text x={0} y={0} ref={this.textRef} fill="white" align="center"/>			  
					  <Group x={0} y={0} ref={this.groupRef} width={100} height={150}/>
					  <Rect
					  		x={0}
					  		y={0}
					  		width={1}
					  		height={1}
					  		strokeEnabled={false}
					  		cornerRadius={5}
					  		ref={this.shapeRef}
					  		lineCap="round"
					  	/>
					  	<Circle
					  		x={0}
					  		y={0}
					  		radius={1}
					  		strokeEnabled={false}
					  		fill="#9CA3AF"	
					  		ref={this.circleRef}
					  	/>
				    </Layer>

				    <Layer >
				    	<AddMiddleLayerBtn onClick={this.onAddNeuralLayer}/>
				    </Layer>
				    <Layer>
				    	<Rect x={this.state.rectX} y={this.state.rectY} offsetY={-10} shadowOffsetX={5} shadowColor="gray" onClick={() => this.setState(state => ({
				    		selectedNeuronId:""
				    	}))} shadowOffsetY={5} shadowBlur={25} width={200} height={150}
				    		 fill="#FBBF24" cornerRadius={10} opacity={this.state.selectedNeuronId?100:0} /> 
				    	<Text text={this.state.selectedNeuronId} x={this.state.rectX} y={this.state.rectY} offsetX={-50} offsetY={-25} fill="white"/>
				    	<Text text={this.state.selectedNeuronId?"Click to Close":""} x={this.state.rectX} y={this.state.rectY} offsetX={-65} offsetY={-45} fill="white"/>
				    </Layer>
				</Stage>
			</div>
			);
		}
}


export default Main;