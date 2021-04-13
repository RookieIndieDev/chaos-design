import '../index.css';
import { Stage, Layer, Rect, Text, Group, Circle, Line } from 'react-konva';
import React from "react";
import SidePane from './SidePane.js'
//import simmodel from '../chaosnet/chaoscraftDiscoverySimmodel.json'
import NeuralLayer from './NeuralLayer.js'
import AddMiddleLayerBtn from './AddMiddleLayerBtn.js'
import ExportNNetBtn from './ExportNNetBtn.js'

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
		this.convertToJSON = this.convertToJSON.bind(this);
		this.addTextArea = this.addTextArea.bind(this);
		this.shapeRef = React.createRef();
		this.stageRef = React.createRef();
		this.layerRef = React.createRef();
		this.textRef = React.createRef();
		this.groupRef = React.createRef();
		this.neuralLayerGroup = React.createRef();
		this.neuralShape = React.createRef();
		this.circleRef = React.createRef();		
		this.lineRef = React.createRef();
		this.line = null
		this.state = {
			currentNeuronId:0,
			currentNeuron:"",
			currentLayerNeuronCount:0,
			totalNumberOfNeurons:0,
			numberOfMiddleLayers:0,
			neurons:[],
			middleLayers:[],
			connections:[],
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
			target:null,
			enableWarnbox:false,
			keys:[],
			simmodel:null,
			simmodelNeurons:null,
			errorText:""
		}
	}

	componentDidMount(){
		//console.log(this.simmodelNeurons)
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
					temp = this.state.simmodelNeurons.find(neuron => neuron.$TYPE === this.state.currentNeuron)
					keys = Object.keys(temp).filter(key => key !== "$TYPE" && key !== "$DEFAULT")
					//console.log(keys)
				break;

				case "middle":
					color = "#60A5FA";
					temp = this.state.simmodelNeurons.find(neuron => neuron === this.state.currentNeuron)
					circleTwo = this.circleRef.current.clone({x:-5, y:25, radius:8, shadowOffsetY:5, shadowColor:"gray", shadowBlur:5, name:"neuronConnector"})
					circleTwo.setAttr("connectFrom", false)
					circleTwo.on("click", this.onConnectorClick)
				break;

				case "output":
					color = "#F87171"
					temp = this.state.simmodelNeurons.find(neuron => neuron.$TYPE === this.state.currentNeuron)
					keys = Object.keys(temp).filter(key => key !== "$TYPE" && key !== "$DEFAULT")
					circleTwo = this.circleRef.current.clone({x:-5, y:25, radius:8, shadowOffsetY:5, shadowColor:"gray", shadowBlur:5, name:"neuronConnector" })
					circleTwo.setAttr("connectFrom", false)
					circleTwo.on("click", this.onConnectorClick)
					//console.log(keys)
				break;
				default:
				color=""
			}

			var neuron = {
				_base_type:this.state.baseType,
				id:"neuron-"+this.state.totalNumberOfNeurons,
				$TYPE:(this.state.baseType !== "middle"?this.state.currentNeuron:"MiddleNeuron"),
				dependencies:[]
			}

			if(this.state.baseType === "middle")
				neuron["activator"] = this.state.currentNeuron
			var shape = this.shapeRef.current.clone({width: 120, height: 50, fill:color})
			var text = this.textRef.current.clone({align:"center", width:120, height:50, fontSize:10, padding:20, text:this.state.currentNeuron, wrap:"char", ellipsis:true })
			var neuronId = this.textRef.current.clone({align:"center", width:120, height:50, fontSize:10, padding:30, offsetX:5, text:"neuronId: " + this.state.totalNumberOfNeurons, 
				name:"neuron-" + this.state.totalNumberOfNeurons, wrap:"char"})
			var circle = this.circleRef.current.clone({x:120, y:25, radius:8, shadowOffsetY:5, shadowColor:"gray", shadowBlur:5, name:"neuronConnector"})
			circle.on("click", this.onConnectorClick)
			circle.setAttr("connectFrom", true)
			var group = this.groupRef.current.clone({x:e.target.attrs.x , offsetX: -18, offsetY:(- this.state.currentLayerNeuronCount * 60), keys:keys})

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
		if(this.state.numberOfMiddleLayers === 0){
			this.setState(state => ({
				enableWarnbox:true
			}))
		}
		else{
			this.setState(state => ({
				numberOfMiddleLayers: state.numberOfMiddleLayers + 1,
				middleLayers: [...state.middleLayers, <NeuralLayer x={250 * (state.middleLayers.length + 1)} stroke="#60A5FA" onClick={this.onNeuralLayerClick} 
				key={this.state.numberOfMiddleLayers} id="middle" baseType="middle" getCurrentLayerNeuronCount={this.getCurrentLayerNeuronCount} isConnecting={this.state.isConnecting} nIndex={this.state.numberOfMiddleLayers + 1}/>],
				
			}))
			this.clearDependenciesAndConnections()
		}
	}

	clearDependenciesAndConnections(){
		let tempNeurons = [...this.state.neurons]
		tempNeurons.forEach(neuron => neuron.dependencies = [])
		this.setState(state => ({
			neurons: tempNeurons,
			connections:[]
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
/*			var temp = this.state.neurons.find(neuron => neuron.id === e.target.parent.children[2].attrs.name)
			temp.dependencies = [this.state.dependencyNeuron]*/
			this.setState(state => ({
				isConnecting:false,
				target:e.target
			}))
			var tempNeurons = [...this.state.neurons]
			tempNeurons.forEach((neuron) => {
				if(neuron.id === e.target.parent.children[2].attrs.name){
					neuron.dependencies.push({neuronId:this.state.dependencyNeuron.id,weight: Math.random() * (10) - 5, _originNaturalGen: 0, _originGen: 0})
				}
			})
			this.setState(state => ({
				neurons:tempNeurons
			}))
			//Checking to see if a neuron is being connected to another neuron in the same layer 
			if(this.state.source.parent.parent._id !== this.state.target.parent.parent._id){
				var diff = Math.abs(this.state.source.parent.parent.getAttr("nIndex") - this.state.target.parent.parent.getAttr("nIndex")) //Check to see if the target's layer is the adjacent to the source layer			
				if((diff) === 1){
					points = [this.state.connectorX, this.state.connectorY, pos.x, pos.y]
					this.setState(state => ({
						connections: [...state.connections, <Line points={points} stroke="#6D28D9" strokeWidth={2} lineCap="round" listening={false} key={state.connections.length}/>]
					}))
				}
			}
		}else if(this.state.isConnecting === false && e.target.attrs.connectFrom === true){
			this.setState(state => ({
				connectorX: pos.x,
				connectorY: pos.y,
				isConnecting:true,
				source:e.target, 
				dependencyNeuron: this.state.neurons.find(neuron => neuron.id === e.target.parent.children[2].attrs.name)
			}))
		} 
	}

	onNeuronClick(e){
		if(!e.target.hasName("neuronConnector")){
			if(e.target.parent.attrs.keys)
				this.setState( state => ({keys:e.target.parent.attrs.keys}))
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

	addTextArea(e){
		var keyName = e.target.text()
		var pos = e.target.getAbsolutePosition()
		let tempNeurons = [...this.state.neurons]
		pos.x += this.stageRef.current.container().getBoundingClientRect().left
		pos.y += this.stageRef.current.container().getBoundingClientRect().top
		var textarea = document.createElement('textarea');
		document.body.appendChild(textarea);
		textarea.placeholder = e.target.text()+" (Press Enter to save)";
		textarea.style.position = 'absolute';
		textarea.style.top = pos.y + 'px';
		textarea.style.left = pos.x + 'px';
		textarea.style.width = e.target.width();
		textarea.style.height = 5

		textarea.focus();

		textarea.addEventListener("keydown", (e) =>{
			/*tempNeurons = [...this.state.neurons]
			var tempNeuron = this.state.neurons.find(neuron => neuron.id === this.state.selectedNeuronId)
			tempNeuron[keyName] = textarea.value
			tempNeurons.forEach(neuron => {
				if(neuron.id === this.state.selectedNeuronId){
					neuron = tempNeuron
				}
			})*/
			if(e.keyCode === 13){
				this.setState( state => ({
					neurons:tempNeurons
				}))
				document.body.removeChild(textarea)
			}

		})

		textarea.addEventListener("keyup", (e) => {
			var tempNeuron = this.state.neurons.find(neuron => neuron.id === this.state.selectedNeuronId)
			if(isNaN(textarea.value)){
				tempNeuron[keyName] = textarea.value
			}else{
				tempNeuron[keyName] = parseFloat(textarea.value)
			}
			

			tempNeurons.forEach(neuron => {
				if(neuron.id === this.state.selectedNeuronId){
					neuron = tempNeuron
				}
			})
		})

		textarea.addEventListener("blur", (e) => {
			document.body.removeChild(textarea)
		})
	}

	render() {
		if(!this.state.simmodel){
			let simmodel;
			return(			
				<div className="justify-center flex w-screen h-screen bg-indigo-500">
				<div className="rounded-xl shadow-2xl opacity-100 h-1/2 w-2/4 mt-52 bg-white pt-20">
					<p className="font-semibold text-4xl text-gray-900 py-5 tracking-wide select-none">
						Let's Begin!
					</p>
					<p className="font-semibold text-2xl text-gray-900 py-5 tracking-wide select-none">
						Upload Your Simmodel
					</p>
					<p className="text-xl text-red-500">{this.state.errorText}</p>
					<input type="file" className="py-10 px-10" accept=".json" onChange={ (e) => 
					{
						if(e.target.files[0].type === "application/json"){
								var fileReader = new FileReader()
								fileReader.readAsText(e.target.files[0])
								fileReader.addEventListener("load", (e) =>{
									simmodel = JSON.parse(fileReader.result)
									if(simmodel.inputNeurons && simmodel.activators && simmodel.outputNeurons){
										this.setState(state => ({
											simmodel:simmodel
										}), () => this.setState(state => ({
											simmodelNeurons:state.simmodel.inputNeurons.concat(state.simmodel.activators.concat(state.simmodel.outputNeurons))
										})))
									}
									else{
										this.setState(state => ({
											errorText:"Error: Invalid Simmodel, upload a correct simmodel"
										}))
									}
								})
							}else{
							this.setState(state => ({
								errorText:"Invalid file, upload the correct JSON Simmodel"
							}))
						}
					}

					}/>
				</div>
				</div>)
		}
		else{
				var exportBtn = this.state.totalNumberOfNeurons > 0?<ExportNNetBtn onClick={this.convertToJSON} data={this.state.jsonOutput}/>:null
				let warnGroup;
				var keyText = this.state.selectedNeuronId?this.state.keys.map((key, index) => <Group>
					<Rect fill="#F59E0B" width={120} height={20} shadowOffsetY = {5} shadowColor="gray" shadowBlur={5} x={this.state.rectX} y={this.state.rectY} offsetX={-10} offsetY={- (index+1) * 35} />
					<Text text={key} x={this.state.rectX} y={this.state.rectY} offsetX={-15} offsetY={- (index+1) * 40} fill="white" onClick={this.addTextArea}/>
					</Group>):null
				if(this.state.enableWarnbox){
				warnGroup=<Group x={500} y={200} width={100}>
					<Rect offsetY={-10} shadowOffsetX={0} shadowColor="gray" fill="#EF4444" shadowOffsetY={0} shadowBlur={25} width={500} height={450} cornerRadius={10}/>
					<Text offsetX={-100} offsetY={-100} fontSize={25} text="Adding a new Middle layer for the first time will clear existing connections you have made, are you sure you want to continue?" fill="white" width={300} wrap="word" align="center"/>
					<Group onClick={() => this.setState(state => ({
							enableWarnbox:false
						}))}>
						<Rect offsetY={-300} offsetX={-150} shadowColor="gray" fill="#E5E7EB" width={90} height={50} cornerRadius={10} />
						<Text offsetX={-45} offsetY={-310} fontSize={20} text="No" fill="red" width={300} wrap="word" align="center"/>
					</Group>
					<Group onClick={() => {
						this.setState(state => ({
											enableWarnbox:false,
											numberOfMiddleLayers: state.numberOfMiddleLayers + 1,
											middleLayers: [...state.middleLayers, <NeuralLayer x={250 * (state.middleLayers.length + 1)} stroke="#60A5FA" onClick={this.onNeuralLayerClick} 
											key={this.state.numberOfMiddleLayers} id="middle" baseType="middle" getCurrentLayerNeuronCount={this.getCurrentLayerNeuronCount} isConnecting={this.state.isConnecting} nIndex={this.state.numberOfMiddleLayers + 1}/>]
										}))
						this.clearDependenciesAndConnections()
					}}>
						<Rect offsetY={-300} offsetX={-250} shadowColor="gray" fill="#E5E7EB" width={90} height={50} cornerRadius={10} />

						<Text offsetX={-145} offsetY={-310} fontSize={20} text="Yes" fill="red" width={300} wrap="word" align="center"/>
					</Group>
				</Group>
				}else{
					warnGroup=null
				}

				return(
					<div className="flex flex-row">
						<SidePane onNeuronSelect={this.onNeuronSelect} currentNeuronId={parseInt(this.state.currentNeuronId)} 
							inputNeurons={this.state.simmodel.inputNeurons} outputNeurons={this.state.simmodel.outputNeurons} activators={this.state.simmodel.activators}
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

						    <Layer>
								{exportBtn}
						    	<AddMiddleLayerBtn onClick={this.onAddNeuralLayer}/>
						    	<Text text={this.state.isConnecting?"Connecting, press right click to exit connect mode":""} x={100} y={window.innerHeight * 0.85} fill="blue"/>
						    </Layer>
						    <Layer>
						    	{warnGroup}
						    	<Rect x={this.state.rectX} y={this.state.rectY} offsetY={-10} shadowOffsetX={5} shadowColor="gray" onClick={() => this.setState(state => ({
						    		selectedNeuronId:"",
						    		keys:[]
						    	}))} shadowOffsetY={5} shadowBlur={25} width={200} height={150}
						    		 fill="#FBBF24" cornerRadius={10} opacity={this.state.selectedNeuronId?100:0} /> 
						    	{keyText}
						    	<Text text={this.state.selectedNeuronId} x={this.state.rectX} y={this.state.rectY} offsetX={-50} offsetY={-25} fill="white"/>
						    	<Text text={this.state.selectedNeuronId?"Click to Close":""} x={this.state.rectX} y={this.state.rectY} offsetX={-65} offsetY={-100} fill="white"/>
						    </Layer>
						</Stage>
					</div>
					);
			}

		}
}


export default Main;