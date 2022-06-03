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
		prevLayer[0].children.forEach((item, itemIndex) => {
			if(item.attrs.name !== "neuralLayer"){
				nextLayer[0].children.forEach((neuron, index) => {
					if(neuron.attrs.name !== "neuralLayer"){
						let dependency = {}
						dependency.neuronId = item.children[2].attrs.text.split(": ")[1]
						dependency.weight = Math.random()
						dependency.targetId = neuron.children[2].attrs.text.split(": ")[1]
						dependencies.push(dependency)
					}		
				})
			}
		})
		prevLayer[0].children.forEach(dep => {
			if(dep.attrs.name !== "neuralLayer"){
				nextLayer[0].children.forEach(neuron => {
					if(neuron.attrs.name !== "neuralLayer"){
						this.props.makeConnection(dep, neuron)
					}
				})
			}
		})
		this.props.fullyConnectLayers(dependencies)
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