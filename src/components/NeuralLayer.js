import React from 'react'
import { Rect, Group } from 'react-konva';

class NeuralLayer extends React.Component
{
	constructor(props){
		super(props);
		this.state = {
			neuronCount:0,
			scaleY:1,
			isSelected:false
		}
		this.onLayerClick = this.onLayerClick.bind(this);
	}

	onLayerClick(e){

		if(this.props.baseType === this.props.id)
		{
			this.setState(state => (
			{
				neuronCount:state.neuronCount+1,
				scaleY:state.scaleY + (state.neuronCount * 0.01)
			}))
		}
		this.props.getCurrentLayerNeuronCount(this.state.neuronCount)
		this.props.onClick(e)
	}


	render()
	{
		return(
			  	<Group id="layerGroup" offsetX={this.props.offsetX} >
					<Rect
						x={this.props.x}
					 	width={150}
					  	height={550}
					  	cornerRadius={2}
					  	lineCap="round"
					  	stroke={this.props.stroke}
					  	shadowColor="grey"
					  	shadowOffsetX={0}
					  	shadowOffsetY={6}
					  	shadowBlur={5}
					  	onClick={(e) => this.onLayerClick(e)}
					  	id={this.props.id}
					  	scaleY={this.state.scaleY}
					 />
				  	</Group>
			)
	}
} 

export default NeuralLayer;