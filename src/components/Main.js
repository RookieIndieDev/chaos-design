import '../index.css';
import { Stage, Layer, Rect, Text, Group, Circle } from 'react-konva';
import React from "react";
import SidePane from './SidePane.js'
import simmodel from '../chaosnet/chaoscraftDiscoverySimmodel.json'
import NeuralLayer from './NeuralLayer.js'

class Main extends React.Component
{

	constructor(){
		super();
		this.handleStageClick = this.handleStageClick.bind(this);
		this.onNeuronSelect = this.onNeuronSelect.bind(this);
		this.onAddNeuralLayer = this.onAddNeuralLayer.bind(this);
		this.getCurrentLayerNeuronCount = this.getCurrentLayerNeuronCount.bind(this);
		this.onScroll = this.onScroll.bind(this);
		this.onLayerDrag = this.onLayerDrag.bind(this);
		this.shapeRef = React.createRef();
		this.stageRef = React.createRef();
		this.layerRef = React.createRef();
		this.textRef = React.createRef();
		this.groupRef = React.createRef();
		this.neuralLayerGroup = React.createRef();
		this.neuralShape = React.createRef();
		this.simmodel = {simmodel}
		this.state = {
			currentNeuronId:0,
			currentNeuron:"",
			currentLayerNeuronCount:0,
			totalNumberOfNeurons:0,
			numberOfMiddleLayers:0,
			middleLayers:[],
			baseType:"",
			neurons:[],
			scaleAmount:1,
			neuralLayerX:0,
			neuralLayerY:0
		}
	}

	handleStageClick(e){
		var color = "";
		if(this.state.currentNeuron && this.state.baseType === e.target.attrs.id)
		{
			this.setState(state => ({
				totalNumberOfNeurons: state.totalNumberOfNeurons+1
			}))

			switch(this.state.baseType){
				case "input":
				color = "#10B981";
				break;

				case "middle":
				color = "#60A5FA";
				break;

				case "output":
				color = "#F87171"
				break;
				default:
				color=""
			}
			var shape = this.shapeRef.current.clone({width: 100, height: 50, fill:color})
			var text = this.textRef.current.clone({align:"center", width:100, height:50, fontSize:10, padding:20, text:this.state.currentNeuron, wrap:"char"})
			var neuronId = this.textRef.current.clone({align:"center", width:120, height:50, fontSize:10, padding:30, offsetX:5, text:"neuronId: " + this.state.totalNumberOfNeurons, wrap:"char"})
			var group = this.groupRef.current.clone({x:e.target.attrs.x , offsetX: -25, offsetY:(- this.state.currentLayerNeuronCount * 60)})
			var neuron = {
				_base_type:this.state.baseType,
				id:"neuron-"+this.state.totalNumberOfNeurons,
				$TYPE:this.state.currentNeuron,
				dependencies:[]
			}
			group.add(shape)
			group.add(text)
			group.add(neuronId)
			e.target.parent.add(group)
			this.setState({neurons: [...this.state.neurons, neuron]}) 
			this.layerRef.current.batchDraw();
		}


	}

	onAddNeuralLayer(){
		this.setState(state => (
		{
			baseType: "middle"
		}))

		this.setState(state => ({
			numberOfMiddleLayers: state.numberOfMiddleLayers + 1,
			middleLayers: [...state.middleLayers, <NeuralLayer x={250 * (state.middleLayers.length + 1)} stroke="#60A5FA" onClick={this.handleStageClick} 
			key={this.state.numberOfMiddleLayers} id="middle" baseType={this.state.baseType} getCurrentLayerNeuronCount={this.getCurrentLayerNeuronCount}/>]
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
				scaleAmount: state.scaleAmount + e.evt.deltaY * -0.01
			}))
	}

	getCurrentLayerNeuronCount(count){
		this.setState(state => ({
			currentLayerNeuronCount:count
		}))
	}

	onLayerDrag(e){
		console.log(e.evt)
	}


	render() {
		return(
			<div className="flex flex-row">
				<SidePane onNeuronSelect={this.onNeuronSelect} currentNeuronId={parseInt(this.state.currentNeuronId)} 
					inputNeurons={simmodel.inputNeurons} outputNeurons={simmodel.outputNeurons} activators={simmodel.activators}
					currentNeuron={this.state.currentNeuron} onAccordionSelect={this.onAccordionSelect}/>
				<Stage width={window.innerWidth} height={window.innerHeight} className="bg-gray-200 overflow-y-hidden overflow-x-hidden" ref={this.stageRef} onWheel={e => this.onScroll(e)}>
				  <Layer ref={this.layerRef} draggable scaleX={this.state.scaleAmount} scaleY={this.state.scaleAmount} x={this.state.neuralLayerX} y={this.state.neuralLayerY} onDragStart={this.onLayerDrag}>
					  <Group ref={this.neuralLayerGroup} x={250} y={50}>
						  <NeuralLayer stroke="#10B981" onClick={this.handleStageClick} id="input" baseType={this.state.baseType} getCurrentLayerNeuronCount={this.getCurrentLayerNeuronCount}/>
						  {this.state.middleLayers}
						  <NeuralLayer offsetX={-250 * (this.state.middleLayers.length + 1)} stroke="#F87171"onClick={this.handleStageClick} id="output" baseType={this.state.baseType}
						   getCurrentLayerNeuronCount={this.getCurrentLayerNeuronCount}/>
					  </Group>			  
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

					  	<Text x={0} y={0} ref={this.textRef} fill="white" align="center"/>


				    </Layer>
				    <Layer>
				    	<Group x={window.innerWidth * 0.55} y={window.innerHeight * 0.85} onClick={this.onAddNeuralLayer}>
				     		<Rect width={150} height={50} fill="#6366F1" cornerRadius={5} strokeEnabled={false} shadowColor="gray" shadowBlur={10} shadowOffsetY={5} shadowOffsetX={5}/>
				     		<Text text="+ Add Middle Layer" offsetX={-15} offsetY={-19} fontSize={15} fill="white" align="center"/>
				    	</Group>	
				    </Layer>
				</Stage>
			</div>
			);
		}
}


export default Main;