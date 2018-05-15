import React, {Component} from 'react'
import uuid from 'uuid'
import Napchart from 'napchart'


export default class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: uuid.v4()
    }
  }

  componentDidMount() {
    var resizer = this.refs.resizer

    this.updateDimensions(() =>
      this.initializeChart()
    )

    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  componentWillUpdate() {
    return false
  }

  render() {
    var blurClass = ''
    if (this.props.loading) {
      blurClass = 'blur'
    }
    return (
      <div className="Chart" ref="resizer">
        <canvas className={"canvas " + blurClass} width={this.state.width} height={this.state.height} ref={this.state.id}>
          A chart
        </canvas>
      </div>
    )
  }

  handleResize = () => {
    this.updateDimensions(() =>
      this.props.napchart.updateDimensions()
    )
  }

  updateDimensions = (callback) => {
    var resizer = this.refs.resizer
    this.setState({
      width: resizer.clientWidth,
      height: resizer.clientHeight,
    }, callback)
  }

  initializeChart() {
    let storage = window.localStorage;
    let schedule = JSON.parse(storage.getItem("schedule"));
    console.log(schedule);

    var canvas = this.refs[this.state.id]
    var ctx = canvas.getContext('2d')

    var napchart = Napchart.init(ctx, {}, {
        responsive: true,
        ampm: this.props.ampm
      })

      napchart.onUpdate = () => {
        this.props.onUpdate()
      }

      // for debugging
      window.napchart = napchart

      canvas.oncontextmenu = function (event) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
      if(schedule != null){
        napchart.data.elements = schedule;
      }

      this.props.setGlobalNapchart(napchart)

  }
}
