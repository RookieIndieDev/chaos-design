import React from 'react'
import {Rect, Group, Arrow} from 'react-konva'

class FullyConnectButton extends React.Component
{
	constructor(props){
		super()
		this.state={
			prevLayerId:props.prevLayerId,
			nextLayerId:props.nextLayerId,
			hovering:false
		}
	}

	render(){
		return(
			<Group offsetY={-510} offsetX={this.props.offsetX}>
				<Rect width={50} height={30} stroke={this.state.hovering?"blue":"gray"} cornerRadius={5} opacity={0.65} 
				onMouseEnter={() => this.setState(state => ({hovering: true}))} onMouseLeave={() => this.setState(state => ({hovering: false}))} />
				<Arrow points={[15, 15, 35, 15]} fill={this.state.hovering?"blue":"gray"} stroke={this.state.hovering?"blue":"gray"} 
				pointerLength={10} pointerWidth={10} opacity={0.65} listening={false}/>
			</Group>
		)
	}
}

export default FullyConnectButton