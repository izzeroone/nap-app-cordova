import * as Ons from 'react-onsenui'
import c from 'classnames'

import React, {Component} from 'react'

import Chart from './Chart.jsx'
import Cookies from 'js-cookie';

import ColorPicker from './Control/ColorPicker.jsx'
import Lanes from './Control/Lanes.jsx'
import SelectedElement from './Control/SelectedElement.jsx'
import Shapes from './Control/Shapes.jsx'
import SuperLanes from './Control/SuperLanes.jsx'
import Schedule from './Control/Schedule1.jsx'

export default class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      napchart: false, // until it is initialized
      ampm: this.getAmpm(),
      selectedControl: 0,
      toastShown: false
    }
  }
  
  renderToolbar = () => {
    return (  
      <Ons.Toolbar>
        <div className='left'>Sleep Planning</div>
        <div className='right'>
        <Ons.ToolbarButton onClick={this.setAlarm}>
          <Ons.Icon icon='md-alarm'></Ons.Icon>
        </Ons.ToolbarButton>
        <Ons.ToolbarButton onClick={this.saveSchedule}>
          <Ons.Icon icon='md-floppy'></Ons.Icon>
        </Ons.ToolbarButton>
        </div>
      </Ons.Toolbar>
    )
  } 

  selectControl = (index) => {
    this.setState({selectedControl: index});
    console.log(this.state.selectedControl);
  }

  toggleSchedule = () => {
    this.setState({
      showSchedule: !this.state.showSchedule
    })
  }

  renderBottomToolbar = () => {
    return (
    <Ons.BottomToolbar className='ons-toolbar'> 
        <div className="center">
          <Ons.Segment index={this.state.selectedControl} onPostChange={() => this.setState({ selectedControl: event.index})} style={{ width: '100%' }}>
                <button  style={{ width: '25%' }}>Element</button>
                <button  style={{ width: '25%' }}>Shape</button>
                <button  style={{ width: '25%' }}>Lanes</button>
                <button  style={{ width: '25%' }}>Schedule</button>
          </Ons.Segment>
        </div>
    </Ons.BottomToolbar>)
  }

  handleChange = (e) => {
    this.setState({selectedControl: e.activeIndex});
  }

  toggleToast = (e) => {
    this.setState({toastShown: !this.state.toastShown});
  }

  render() {
    let controls = [
      <SelectedElement napchart={this.state.napchart}/>,
      <Shapes napchart={this.state.napchart}/>,
      <SuperLanes napchart={this.state.napchart}/>,
      <Schedule napchart={this.state.napchart}/>
    ]


    return (
        <Ons.Page 
        renderToolbar={this.renderToolbar}
        renderBottomToolbar={this.renderBottomToolbar}>
          <Chart
            napchart={this.state.napchart}
            onUpdate={this.somethingUpdate}
            setGlobalNapchart={this.setGlobalNapchart}
            onLoading={this.loading} onLoadingFinish={this.loadingFinish}
            ampm={this.state.ampm}
          />
          <Ons.Carousel onPostChange={this.handleChange} index={this.state.selectedControl}>
            {controls.map((item, index) => (
              <Ons.CarouselItem key={index}>
                {item}
              </Ons.CarouselItem>
            ))}
          </Ons.Carousel>
        <Ons.Toast isOpen={this.state.toastShown}>
          <div className="message">
            An error has occurred!
          </div>
          <button onClick={this.toggleToast}>
            Dismiss
          </button>
        </Ons.Toast>
        </Ons.Page>
    )
  }



  setGlobalNapchart = (napchart) => {
    this.setState({
      napchart: napchart
    })
  }

  somethingUpdate = (napchart) => {
    this.forceUpdate()
  }


  setNumberOfLanes = (lanes) => {
    console.log(lanes)
    this.state.napchart.setNumberOfLanes(lanes)
  }

  getAmpm = () => {

    const cookiePref = Cookies.get('preferAmpm')
    if (cookiePref) {
      return eval(cookiePref)
    }

    var date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
    var dateString = date.toLocaleTimeString();

    //apparently toLocaleTimeString() has a bug in Chrome. toString() however returns 12/24 hour formats. If one of two contains AM/PM execute 12 hour coding.
    if (dateString.match(/am|pm/i) || date.toString().match(/am|pm/i)) {
      return true
    }
    else {
      return false
    }
  }

  setAmpm = (ampm) => {
    Cookies.set('preferAmpm', ampm)

    this.setState({
      ampm: ampm
    })
  }

  saveSchedule = () => { 
    let storage = window.localStorage;
    storage.setItem("schedule", JSON.stringify(this.state.napchart.data.elements));
    console.log(storage);
  }

  setAlarm = () => {
    console.log(this.state.napchart.data.elements);
    this.state.napchart.data.elements.forEach(element => {
      cordova.plugins.notification.local.schedule({
        title: 'Time to go sleep',
        text: 'Sleep well',
        trigger: { every: { hour: Math.floor(element.start / 60), minute: element.start % 60}},
        foreground: true
      });
      cordova.plugins.notification.local.schedule({
        title: 'Time to wake up',
        text: 'Wake up now!',
        trigger: { every: { hour: Math.floor(element.end / 60), minute: element.end % 60}},
        foreground: true
      });
    });
    cordova.plugins.notification.local.schedule({
      title: 'Set alarm sucessful',
      text: 'Wake up on time',
      foreground: true
  });
  }

}
