'use strict';

import React from 'react';
import _ from 'lodash';

class Thumbnail extends React.Component {

	constructor(props) {

		super(props);

		// Default state
		this.state = {
			open: false,
			mountContent: false,
			zIndex: null
		};

		// Component DOM elements
		this.els = {};

		// The default element position
		this.defaultPosition = {};

		this.timeline = false;

		// Create Throttled versions to improve performance
		this.openBlockThrottle = _.throttle(this.openBlock, 200);
		this.onWindowResizeHandlerThrottle = _.throttle(this.onWindowResizeHandler, 200);

		this.posterStyle = {
			backgroundImage: 'url(' + this.props.posterImg + ')',
			backgroundPosition: 'center center',
			backgroundSize: 'cover'
		};

		// the default location hash name
		this.defaultLocationHashName = '';

		// header elements
		this.headerLogo = null;

	}

	componentDidMount() {

		// Set event listeners
		this.setEventListeners();

	}

	setEventListeners() {

		// Scroll event listener
		window.addEventListener('scroll', e => this.onScrollHandler(e));

		// On window resize handler
		window.addEventListener('resize', e => this.onWindowResizeHandlerThrottle(e), false);

	}

	removeEventListeners() {

		window.removeEventListeners('scroll', this.onScrollHandler);

	}

	setBlockDefaults() {

		for (const key in this.els) {
			if (this.defaultPosition[key]) {
				this.defaultPosition[key] = this.calcElementPosition(this.els[key]);
			}
		}

	}

	setBlockSize(el) {

		el.style.width = this.defaultPosition[''] + 'px';

	}

	setElement(key, node) {

		this.els[key] = node;

	}

	calcElementPosition(el) {

		return el.getBoundingClientRect();

	}

	updateHash() {

		// update hash and toggle component mount
		window.location.hash = '#/projects/' + this.props.urlHash;

	}

	openBlock(callback = false) {

		if (this.state.open) {

			//this.closeBlock();

		} else {

			this.setState({
				open: true
			});

			// get updated timeline with correct position
			// the user may have scrolled
			this.timeline = this.updateTimeline();
			this.els.block.parentNode.style.zIndex = 999;
			this.timeline.play();

		}

		if (typeof callback === 'function') {
			callback();
		}

	}

	closeBlock(callback = false) {

		setTimeout(() => {
			if (this.els.block) {
				this.resetBlock();
			}
		});

		// this should be moved and treated only for modal elements
		history.pushState(null, null, '#/' + this.defaultLocationHashName);

		if (typeof callback === 'function') {
			callback();
		}
	}

	resetBlock() {
		window.scroll(0, 0);
		this.els.block.setAttribute('style', null);
		this.els.block.parentNode.style.zIndex = '';
		this.props.setNoScroll(false);
		this.setState({
			open: false,
			mountContent: false
		});
	}

	initTimeline() {

		let timeline;

		// Initialise the timeline if not declared yet to cache it
		if (!this.timeline) {

			let c = document.querySelector('.content .wrapper');
			let offset = window.getComputedStyle(c, null).getPropertyValue('margin-left');
			offset = parseInt(offset, 0);

			// Calculate DOM position
			this.pos = this.calcElementPosition(this.els.block);
			this.headerLogo = document.querySelector('header .logo-container');

			// Open the Modal
			let cssBefore = {
								css: {
										width: this.pos.width,
										height: this.pos.height,
										position: 'absolute',
										top: 0,
										left: this.pos.left - offset
									}
							};

			let cssAfter = {
								css: {
										width: window.innerWidth,
										height: window.innerHeight,
										top: -this.pos.top,
										position: 'absolute',
										left: -offset
									}
							};

			const onStartCallback = () => {
				//this.props.setNoScroll(true);
			};

			const onCompleteCallback = () => {

				this.setState({
					open: true
				});

				// refactor to treat only modal elements
				this.updateHash();

			};
			const onReverseCompleteCallback = () => {
				// todo: check state when routing from non home to home
				if (this.els.block) {
					this.els.block.parentNode.style.zIndex = '';
					this.props.setNoScroll(false);
					this.setState({
						open: false
					});
				}
			};
			timeline = new window.TimelineLite({
				onStart: onStartCallback,
				onComplete: onCompleteCallback,
				onReverseComplete: onReverseCompleteCallback
			});

			timeline.to(this.els.titleContainer, 0.3, { css: { opacity: 0 } });
			timeline.fromTo(this.els.block, 0.2, cssBefore, cssAfter);
			timeline.pause();

		}

		return timeline;

	}


	updateTimeline() {

		let timeline;

		if (this.timeline) {
			this.clearTimeline();
		}

		timeline = this.initTimeline();

		return timeline;

	}

	clearTimeline() {
		this.timeline.clear();
		this.timeline = null;
	}

	reinitTimeline() {
		this.clearTimeline();
		this.timeline = this.updateTimeline();
	}

	onBlockOpen() {

		// Set block element to fix position
		this.props.setNoScroll(true);

		// Update children mount state
		this.setState({
			mountContent: true
		});

	}

	onBlockCollapse() {

		// Set block element to fix position
		this.props.setNoScroll(false);

		// Update children mount state
		this.setState({
			mountContent: false
		});

	}

	onScrollHandler() {

	}

	onWindowResizeHandler() {

		// Reset the timeline and remove any styles set by GSAP
		// and also recalc the timeline
		if (this.els.block.getAttribute('style') !== null) {
			this.clearTimeline();
			this.els.block.style = null;
		}

	}

	setZIndex() {

		let zIndex = null;

		if (this.state.open) {
			zIndex = 999;
		} else {
			zIndex = null;
		}

		this.setState({
			zIndex: zIndex
		});

		return null;

	}

	caseStudyRequestHandler() {

		let location = this.props.location;

		if (location.pathname && location.pathname.indexOf('projects') > -1) {
			let arr = location.pathname.split('/');
			let name = arr[2];
			if (this.props.urlHash === name) {
				this.openBlock();
			}
		}

	}

	render() {

		return (
			<div className={'thumbnail' + ' ' + this.props.className + ' ' + (this.state.open ? 'open' : '')}>
				<div className='block' ref={this.setElement.bind(this, 'block')} onClick={this.openBlockThrottle.bind(this)}>
						<div className='content' style={this.posterStyle}>

						</div>
						<div className={'title-container'} ref={this.setElement.bind(this, 'titleContainer')}>
							<h4 ref={this.setElement.bind(this, 'title')}>{this.props.title}</h4>
							<span className='separator'> - </span>
							<p ref={this.setElement.bind(this, 'description')} dangerouslySetInnerHTML={ { __html: this.props.description } }></p>
						</div>
				</div>
			</div>
		);

	}

}

export default Thumbnail;