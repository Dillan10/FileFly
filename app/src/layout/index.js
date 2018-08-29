import React, {Component} from 'react'
import Home from '../pages/home'
import {Router, Route, Switch} from 'react-router-dom'


class Layout extends Component {


    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {


        return (
            <div className={'app-layout'}>
                <Home/>
            </div>
        )
    }
}

export default Layout;