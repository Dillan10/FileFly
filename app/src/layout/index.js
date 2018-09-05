import React, {Component} from 'react'
import Home from '../pages/home'
<<<<<<< HEAD

=======
import {Router,Route,Switch} from 'react-router-dom'
import {history} from "../history";
import View from "../pages/view"
>>>>>>> 00f8dac4066e9a8cf569914c132df6c330918499
class Layout extends Component {


    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {


        return (
            <div className={'app-layout'}>
<<<<<<< HEAD
                <Home/>
=======
               <Router history={history}>
                   <Switch>
                       <Route exact path={'/'} component = {Home}/>
                       <Route exact path={'/share/:id'} component = {View}/>

                   </Switch>
               </Router>
>>>>>>> 00f8dac4066e9a8cf569914c132df6c330918499
            </div>
        )
    }
}

export default Layout;
