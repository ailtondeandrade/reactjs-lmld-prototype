'use strict';

import React from 'react';
import Footer from '../containers/Footer';
import Header from '../containers/Header';
import BackBlock from '../components/BackBlock';

class Main extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loadComponent: null,
			hideMainContent: false
		};

		this.timelineCenterBlock = null;

		// Component DOM elements
		this.els = {};

	}

	componentWillMount() {

	}

	componentDidMount() {

	}

	/*
	 * Display the yellow square block animation, mount the requested component
	 * remove the square block, revealing the `main` component content area
	 * only when user press the logo button to go back
	 * @param: componentName
	 * @return: null
	 */
	hideMainContentHandler() {

		const onStartCallback = () => {
			this.props.setNoScroll(true);
		};

		const onCompleteCallback = () => {

			/*
			this.setState({
				loadComponent: componentName
			});
			*/

		};

		const onReverseCompleteCallback = () => {

		};

		this.timelineCenterBlock = new window.TimelineLite({
			onStart: onStartCallback,
			onComplete: onCompleteCallback,
			onReverseComplete: onReverseCompleteCallback
		});

		this.timelineCenterBlock.pause();

	}

	setNoScroll(bool) {

		let cl = document.body.classList;

		bool ? cl.add('noscroll') : cl.remove('noscroll');

	}

	isHome() {

		return this.props.location.pathname === '/' ? 'home' : 'lg-bg';

	}

	setElement(key, node) {

		this.els[key] = node;

	}

	render() {

		return(

			<div className={'main' + ' ' + this.isHome() + ' ' + (this.hideMainContent ? 'hidden' : '')}>
				<Header component={Header} />
				<div className="content">
					<BackBlock />
					{React.cloneElement(this.props.children, { setNoScroll: this.setNoScroll.bind(this) })}
					{this.state.loadComponent ? <this.state.loadComponent /> : null}
				</div>
				<Footer isHome={this.isHome()} />
			</div>
		);

	}

}

export default Main;