import React from 'react'
import { Rect, Group } from 'react-konva';

class NeuralLayer extends React.Component
{
	constructor(props){
		super(props);
		this.state = {
			neuronCount:0,
			height:550
		}
		this.onLayerClick = this.onLayerClick.bind(this);
	}

	onLayerClick(e){
		if(this.props.baseType === this.props.id && this.props.isConnecting === false)
		{
			this.setState(state => (
			{
				neuronCount:state.neuronCount+1,
				height: state.height + 50
			}))
		}
		this.props.getCurrentLayerNeuronCount(this.state.neuronCount)
		this.props.onClick(e)
	}


	render()
	{
		return(
			  	<Group id="layerGroup" offsetX={this.props.offsetX} nIndex={this.props.nIndex}>
					<Rect
						x={this.props.x}
					 	width={150}
					  	height={this.state.height}
					  	cornerRadius={2}
					  	lineCap="round"
					  	stroke={this.props.stroke}
					  	shadowColor="grey"
					  	shadowOffsetX={0}
					  	shadowOffsetY={6}
					  	shadowBlur={5}
					  	onClick={(e) => this.onLayerClick(e)}
					  	layerId={this.props.layerId}
					 />
				  	</Group>
			)
	}
} 

export default NeuralLayer;