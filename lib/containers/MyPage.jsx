import React from 'react';
import PropTypes from 'prop-types';
import * as Ons from 'react-onsenui';
import ons from 'onsenui';

var MyPage = React.createClass({
    handleClick: function() {
      ons.notification.alert('Hello world!');
    },
  
    renderToolbar: function() {
      return (
        <Ons.Toolbar>
          <div className='center'>My app</div>
          <div className='right'>
          <Ons.ToolbarButton>
            <Ons.Icon icon='ion-navicon, material:md-menu'></Ons.Icon>
          </Ons.ToolbarButton>
          </div>
        </Ons.Toolbar>
      );
    },
  
    render: function() {
      return (
        <Ons.Page renderToolbar={this.renderToolbar}>
          <p style={{textAlign: 'center'}}>
            <Ons.Button onClick={this.handleClick}>
              Click me!
            </Ons.Button>
          </p>
        </Ons.Page>
      );
    }
  });
  export default MyPage;