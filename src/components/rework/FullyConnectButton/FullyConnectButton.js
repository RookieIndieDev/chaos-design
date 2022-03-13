import React from 'react'
import {Rect, Group, Arrow} from 'react-konva'

class FullyConnectButton extends React.Component
{
	constructor(props){
		super(props)
		this.state={
			hovering:false
		}
		this.onClick = this.onClick.bind(this)
	}

	onClick(e){
		let stage = e.target.getStage()
		let prevId = this.props.sourceLayerIndex
		let nextId = this.props.targetLayerIndex
		let prevLayer = stage.find(node => {
			return node.attrs.id === prevId
		})
		let nextLayer = stage.find(node => {
			return node.attrs.id === nextId
		})
		let dependencies = []
		let neurons = []

		prevLayer[0].parent.children.forEach(item => {
			if(item.attrs.name !== "neuralLayer"){
				let dependency = {}
				dependency.neuronId = item.children[2].attrs.text.split(": ")[1]
				dependency.weight = Math.random() * (10) - 5 
				dependencies.push(dependency)
			}
		})
		nextLayer[0].parent.children.forEach(item => {
			if(item.attrs.name !== "neuralLayer"){
				let neuron = {}
				neuron.neuronId = item.children[2].attrs.text.split(": ")[1]
				neurons.push(neuron)
			}
		})
		prevLayer[0].parent.children.forEach(dep => {
			if(dep.attrs.name !== "neuralLayer"){
				nextLayer[0].parent.children.forEach(neuron => {
					if(neuron.attrs.name !== "neuralLayer"){
						this.props.makeConnection(dep, neuron)
					}
				})
			}
		})
		this.props.fullyConnectLayers(dependencies, neurons)
	}

	render(){
		return(
			<Group offsetY={-50} offsetX={this.props.offsetX}>
				<Rect width={50} height={30} stroke={this.state.hovering?"blue":"gray"} cornerRadius={5} opacity={0.65} 
				onMouseEnter={() => this.setState(state => ({hovering: true}))} onMouseLeave={() => this.setState(state => ({hovering: false}))} onClick={this.onClick}/>
				<Arrow points={[15, 15, 35, 15]} fill={this.state.hovering?"blue":"gray"} stroke={this.state.hovering?"blue":"gray"} 
				pointerLength={10} pointerWidth={10} opacity={0.65} listening={false}/>
			</Group>
		)
	}
}

export default FullyConnectButton