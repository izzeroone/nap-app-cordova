import React, {Component} from 'react'
import * as Ons from 'react-onsenui'

export default class Controls extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: [
                '#F1948A',
                '#D7BDE2',
                '#85C1E9',
                '#73C6B6',
              ],
            index: 1
        };
    }

    setIndex = (index) => {
        this.setState({index: index});
    }

    handleChange = (e) => {
        this.setIndex(e.activeIndex);
    }

    render(){
        return (
                <Ons.Carousel onPostChange={this.handleChange} index={this.state.index} swipeable autoScroll overscrollable>
                  {this.state.items.map((item, index) => (
                    <Ons.CarouselItem key={index} style={{backgroundColor: item}}>
                      <div style={{marginTop: '50%', textAlign: 'center'}}>
                        Swipe me!
                      </div>
                      </Ons.CarouselItem>
                  ))}
                </Ons.Carousel>
        
                // <div style={{
                //   textAlign: 'center',
                //   fontSize: '20px',
                //   position: 'absolute',
                //   bottom: '36px',
                //   left: '0px',
                //   right: '0px'
                // }}>
                //   {this.state.items.map((item, index) => (
                //     <span key={index} style={{cursor: 'pointer'}} onClick={this.setIndex.bind(this, index)}>
                //       {this.state.index === index ? '\u25CF' : '\u25CB'}
                //     </span>
                //   ))}
                // </div>
            );

    }
}
