import React from 'react'
import ColorPicker from './ColorPicker.jsx'

export default class SelectedElement extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toastShown: false
    }
  }
  setAlarm(element){
    let sleepTime = this.getTimeFromMinute(element.start);
    let wakeupTime = this.getTimeFromMinute(element.end);
    
    var now = new Date();
    var now1late = new Date();
    now1late.setMinutes(now1late.getMinutes() + 1);
    var dateSleep = new Date();
    var dateWake = new Date();
    dateSleep.setHours(sleepTime.hour);
    dateSleep.setMinutes(sleepTime.minute);
    dateWake.setHours(wakeupTime.hour);
    dateWake.setMinutes(wakeupTime.minute);
    console.log(dateSleep);
    console.log(dateWake);
    console.log(now);
    console.log(now1late);
    cordova.plugins.notification.local.schedule([{
      title: 'Alarm has been set',
      text: 'Happy hacking',
      firstAt: now,
      foreground: true
    },{
      title: 'Just make sure that you just set alarm',
      text: '1 minute late',
      firstAt: now1late,
      foreground: true
    },{
      title: 'Time to go sleep',
      text: 'Sleep well',
      firstAt: dateSleep, // firstAt and at properties must be an IETF-compliant RFC 2822 timestamp
      every: "day",
      foreground: true
    },{
      title: 'Time to wake up',
      text: 'Wake up now!',
      firstAt: dateWake, // firstAt and at properties must be an IETF-compliant RFC 2822 timestamp
      every: "day",
      foreground: true
    }]);
  ;
  }

  getTimeFromMinute = (minute) => {
    return {
      hour: Math.floor(minute / 60),
      minute: minute % 60
    }
  }
  render() {
    var napchart = this.props.napchart
    var selected = napchart.selectedElement

    if (napchart) {
      var element = napchart.data.elements.find(e => e.id == selected)
      var activeColor = (typeof element == 'undefined') ? napchart.config.defaultColor : element.color


      return (
        <div className="SelectedElement">
          <div className="field">
            <ColorPicker
              onClick={this.changeColor}
              activeColor={activeColor}
            />
          </div>
          <div className="field">
            <input style={{ color: activeColor }} className="colorTag" type='text' placeholder={activeColor + ' ='}
              onChange={this.changeColorTag}
              value={this.colorTag(activeColor)}
            />
          </div>

          {selected &&
            <div>
              <div className="field has-addons level is-mobile">
                <div className="level-left">
                  <div className="level-item">
                    Selected element:
                  </div>
                  <div className="level-item">
                    <button onClick={napchart.deleteElement.bind(napchart, selected)} className="napchartDontLoseFocus button">Delete</button>
                    <button onClick={this.setAlarm.bind(this, element)} className="napchartDontLoseFocus button">Set Alarm</button>
                    {napchart.isTouchUser &&
                      <button onClick={napchart.forceFocusSelected} className="napchartDontLoseFocus button">Edit text</button>
                    }
                  </div>
                </div>
              </div>



            </div>
          }
        </div>
      )


    } else {
      return null
    }
  }

  colorTag = (color) => {
    var napchart = this.props.napchart
    var tagObj = napchart.data.colorTags.find(t => t.color == color)

    if (typeof tagObj == 'undefined') {
      return ''
    } else {
      return tagObj.tag
    }
  }

  changeColor = (color) => {
    var napchart = this.props.napchart
    napchart.changeColor(this.props.napchart.selectedElement, color)
    napchart.config.defaultColor = color
    this.forceUpdate()
  }

  changeColorTag = (e) => {
    var napchart = this.props.napchart
    var activeColor = (typeof element == 'undefined') ? napchart.config.defaultColor : element.color

    napchart.colorTag(activeColor, e.target.value)
    this.forceUpdate()
  }
}