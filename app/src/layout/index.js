import React, {Component} from 'react'
import Home from '../pages/home'
import {Router,Route,Switch} from 'react-router-dom'
import {history} from "../history";
import View from "../pages/view"
class Layout extends Component {


    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {


        return (
            <div className={'app-layout'}>
               <Router history={history}>
                   <Switch>
                       <Route exact path={'/'} component = {Home}/>
                       <Route exact path={'/share/:id'} component = {View}/>

                   </Switch>
               </Router>
            </div>
        )
    }
}

export default Layout;
