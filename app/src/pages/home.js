import React, {Component} from 'react'
import Header from '../components/header'
import HomeForm from "../components/home-form";
import _ from 'lodash'

class Home extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        return (

            <div className={'app-container'}>
                <Header/>
                <div className={'app-content'}>
                    <HomeForm/>
                </div>
            </div>
        )
    }
}


export default Home;