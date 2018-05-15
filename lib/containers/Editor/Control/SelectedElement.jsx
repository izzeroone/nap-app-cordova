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
    let startTime = this.getTimeFromMinute(element.start);
    console.log(startTime);
    cordova.plugins.notification.local.schedule({
      title: 'My first notification',
      text: 'Thats pretty easy...',
      foreground: true
    });
    cordova.plugins.notification.local.schedule({
      title: 'Time to go sleep',
      text: 'Sleep well',
      trigger: { every: { hour: startTime.hour, minute: startTime.minute}}
    });
    cordova.plugins.notification.local.schedule({
      title: 'Time to go sleep',
      text: '3:00 - 4:00 PM',
      trigger: { every: { hour: 6, minute: 45}}
    });
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