import React,{Component} from 'react';

class View extends Component{
    constructor(props){
        super(props)
    }

    componentWillMount(){
        const {match} = this.props;
        console.log(match)
    }
    render(){
        return(
            <div>Hey is Download View.</div>
        )
    }
}

export default View;
