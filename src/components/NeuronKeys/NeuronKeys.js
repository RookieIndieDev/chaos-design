import {Rect, Text, Group} from 'react-konva';
import React from "react";

class NeuronKeys extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			hovering:false
		}
		this.onClick = this.onClick.bind(this)
	}

	onClick(e){
		var keyName = e.target.parent.children[1].text()
		let pos = {}
		pos.x = e.target.getClientRect().x
		pos.y = e.target.getClientRect().y
		let tempNeurons = this.props.currentNeurons
		let tempNeuron = {}
		let neuronId = this.props.selected.split(" ")[1]
		var text = document.createElement('input');
		text.type = "text"
		document.body.appendChild(text);
		text.placeholder = e.target.parent.children[1].text() +" (Enter to update)";
		text.style.position = 'absolute';
		text.style.top = pos.y + 'px';
		text.style.left = pos.x + 'px';
		text.style.borderRadius = 5 + "px";
		text.style.borderColor = "#00ccff";
		text.style.borderWidth = 2 + "px";
		text.style.marginTop = 5 + "px";
		text.style.padding = 7 + "px";
		text.focus();

		text.addEventListener("keydown", (e) =>{
			if(e.keyCode === 13){
				tempNeurons.forEach(neuron => {
					if(neuron.id === neuronId){
						neuron = tempNeuron
					}
				})
				this.props.updateNeurons(tempNeurons)
				document.body.removeChild(text)
			}

		})

		text.addEventListener("keyup", (e) => {
			tempNeuron = tempNeurons.find(neuron => neuron.id === neuronId)
			if(isNaN(text.value)){
				tempNeuron[keyName] = text.value
			}else{
				tempNeuron[keyName] = parseFloat(text.value)
			}
		})

		text.addEventListener("blur", (e) => {
			document.body.removeChild(text)
		})
	}

	render(){
		return(
			<Group>
				<Rect fill={this.state.hovering?"#0D9488":"#14B8A6"} height={50} width={200} offsetX={-225} offsetY={-80 * (this.props.index)} cornerRadius={5}
				onMouseEnter={() => this.setState(state => ({hovering: true}))} 
				onMouseLeave={() => this.setState(state => ({hovering: false}))} onClick={this.onClick}/>
				<Text fill="white" text={this.props.text} offsetX={-250} offsetY={-85 * (this.props.index)} fontStyle="bold" fontFamily="Helvetica" fontSize={20} listening={false}/>
			</Group>
		)
	}
}

export default NeuronKeys;