import React from 'react'
import CodeImage from '../../code.png'
import { Link } from "react-router-dom"

class LandingPage extends React.Component{
	constructor(){
		super()
		this.state = {

		}
	}

	componentDidMount(){
		document.title="Welcome to ChaosDesign"
	}

	render(){
		return(
			<div className="bg-blue-200 w-screen h-screen">
				<div className="px-10 top-10 fixed">
					<p className="text-9xl text-white select-none font-bold align-middle text-left top-20 relative">ChaosDesign</p>
					<p className="text-4xl font-semibold text-gray-50 text-left pt-5 px-2 select-none relative top-20">Quickly and easily create neural networks</p>
					<Link className="px-20 rounded-lg py-5 bg-gray-100 shadow-lg hover:bg-gray-200 hover:py-6 top-60 right-5 relative text-gray-500 hover:text-gray-600 font-semibold select-none" to="/simmodel" state={{new:false}}>Edit your NNet</Link>
					<Link className="px-20 rounded-lg py-5 bg-cyan-600 shadow-lg hover:bg-cyan-500 hover:py-6 relative top-40 right-72 text-white font-semibold select-none" to="/simmodel" state={{new:true}}>Create Your neural Network</Link>
				</div>
				<img src={CodeImage} className="rounded-xl left-2/4 top-10 fixed outline outline-white outline-4 shadow-2xl" alt="code" onContextMenu={(e) => e.preventDefault()}/>
			</div>
			)
	}
}

export default LandingPage;