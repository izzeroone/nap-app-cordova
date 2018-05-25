import * as Ons from 'react-onsenui'
import * as ons from 'onsenui';
import React, {Component} from 'react'

import Chart from './Chart.jsx'
import Cookies from 'js-cookie';
import $ from "jquery";

import SelectedElement from './Control/SelectedElement.jsx'
import Shapes from './Control/Shapes.jsx'
import SuperLanes from './Control/SuperLanes.jsx'
import Schedule from './Control/Schedule1.jsx'
import ChartInfo from "./Control/ChartInfo.jsx";


export default class Editor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            napchart: false, // until it is initialized
            ampm: this.getAmpm(),
            selectedControl: 0,
            toastShown: false,
            chartid: window.chartid,
            title: window.title || '',
            description: window.description || '',
            menuShown: false
        }
    }

    renderToolbar = () => {
        var {napchart} = this.state;
        if (!napchart) {
            return null;
        }

        return (
            <Ons.Toolbar>
                <div className='left'>Sleep Planing</div>
                <div className='right'>
                    <Ons.ToolbarButton onClick={napchart.history.back.bind(napchart)}
                                       disabled={!napchart.history.canIGoBack()}>
                        <Ons.Icon icon='md-undo'></Ons.Icon>
                    </Ons.ToolbarButton>
                    <Ons.ToolbarButton onClick={napchart.history.forward.bind(napchart)}
                                       disabled={!napchart.history.canIGoForward()}>
                        <Ons.Icon icon='md-redo'></Ons.Icon>
                    </Ons.ToolbarButton>
                    <Ons.ToolbarButton onClick={this.saveSchedule}>
                        <Ons.Icon icon='md-floppy'></Ons.Icon>
                    </Ons.ToolbarButton>
                    <Ons.ToolbarButton id="menuButton" ref="menuButton" onClick={this.showMenu}>
                        <Ons.Icon icon='md-menu'></Ons.Icon>
                    </Ons.ToolbarButton>
                </div>
            </Ons.Toolbar>
        )
    };


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
                    <Ons.Segment index={this.state.selectedControl}
                                 onPostChange={() => this.setState({selectedControl: event.index})}
                                 style={{width: '100%'}}>
                        <button style={{width: '33%'}}>Element</button>
                        <button style={{width: '33%'}}>Lanes</button>
                        <button style={{width: '33%'}}>Schedule</button>
                    </Ons.Segment>
                </div>
            </Ons.BottomToolbar>)
    }

    handleChange = (e) => {
        this.setState({selectedControl: e.activeIndex});
    }

    changeTitle = (e) => {
        this.setState({
            title: e.target.value
        })
    };

    changeDescription = (e) => {
        this.setState({
            description: event.target.value
        })
    };

    showMenu = (e) => {
        this.setState({
            menuShown: true
        })
    };

    closeMenu = (e) => {
        this.setState({
            menuShown: false
        })
    };


    render() {
        let controls = [
            <SelectedElement napchart={this.state.napchart}/>,
            <SuperLanes napchart={this.state.napchart}/>,
            <Schedule napchart={this.state.napchart}/>
        ];

        {/*<Shapes napchart={this.state.napchart}/>*/
        }


        return (
            <Ons.Splitter>
                <Ons.SplitterSide side='right' width={220} collapse={true} swipeable={true} isOpen={this.state.menuShown} onClose={this.closeMenu} onOpen={this.showMenu}>
                    <Ons.Page>
                        <Ons.List>
                            <Ons.ListItem tappable><Ons.Icon fixedWidth size="25" icon='md-cloud-download'></Ons.Icon>Load from napchart</Ons.ListItem>
                            <Ons.ListItem tappable><Ons.Icon fixedWidth size="25" icon='md-floppy'></Ons.Icon>Save</Ons.ListItem>
                            <Ons.ListItem tappable><Ons.Icon fixedWidth size="25" icon='md-cloud-upload'></Ons.Icon>Save to napchart</Ons.ListItem>
                            <Ons.ListItem tappable><Ons.Icon fixedWidth size="25" icon='md-share'></Ons.Icon>Share</Ons.ListItem>
                            <Ons.ListItem tappable><Ons.Icon fixedWidth size="25" icon='md-spinner'></Ons.Icon>Clear</Ons.ListItem>
                            <Ons.ListItem tappable><Ons.Icon fixedWidth size="25" icon='md-settings'></Ons.Icon>Setting</Ons.ListItem>
                            <Ons.ListItem tappable><Ons.Icon fixedWidth size="25" icon='md-make'></Ons.Icon>About</Ons.ListItem>
                        </Ons.List>
                    </Ons.Page>
                </Ons.SplitterSide>
                <Ons.SplitterContent>
                    <Ons.Page
                        renderToolbar={this.renderToolbar}
                        renderBottomToolbar={this.renderBottomToolbar}>
                        <Chart
                            ref="chart"
                            napchart={this.state.napchart}
                            onUpdate={this.somethingUpdate}
                            setGlobalNapchart={this.setGlobalNapchart}
                            onLoading={this.loading} onLoadingFinish={this.loadingFinish}
                            ampm={this.state.ampm}
                            showToast={this.showToast}
                        />
                        <Ons.Carousel onPostChange={this.handleChange} index={this.state.selectedControl}>
                            {controls.map((item, index) => (
                                <Ons.CarouselItem key={index}>
                                    {item}
                                </Ons.CarouselItem>
                            ))}
                        </Ons.Carousel>
                    </Ons.Page>
                </Ons.SplitterContent>
            </Ons.Splitter>

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
        storage.setItem("chartData", JSON.stringify(this.state.napchart.data));
        console.log(this.state.napchart.data);
        ons.notification.toast("Save chart data successful", {timeout: 1000});
    };

    setAlarm = () => {
        console.log(this.state.napchart.data.elements);
        let sucess = () => {
            console.log("success");
        };
        let fail = () => {
            console.log("fall");
        };
        this.state.napchart.data.elements.forEach(element => {
            cordova.exec(sucess, fail, 'setalarm', 'coolMethod', [Math.floor(element.start / 60), element.start % 60]);
            cordova.exec(sucess, fail, 'setalarm', 'coolMethod', [Math.floor(element.end / 60), element.end % 60]);

        });
    }

}
