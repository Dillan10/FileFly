import React, {Component} from 'react'
import Header from '../components/header'
import HomeForm from "../components/home-form";
import HomeUploading from '../components/home-uploading'


class Home extends Component {

    constructor(props) {

        super(props);

        this.state = {
            componentName: 'HomeForm',
            data: null,
            uploadEvent: null,
        };


        this._renderComponent = this._renderComponent.bind(this)

    }


    _renderComponent() {

        const {componentName, data, uploadEvent} = this.state;

        switch (componentName) {

            case 'HomeUploading':
                //Component called when data upload is in progress
                return <HomeUploading event={uploadEvent} data={data}/>;



            default:
                return <HomeForm
                    /*Make a call to func onUploadEvent on hoe form , hence passing the props from child to parent */
                    onUploadEvent={(event) => {

                        this.setState({
                                uploadEvent: event,
                                componentName: 'HomeUploading'
                            });
                    }}
                    onUploadBegin={(data) => {

                        this.setState({
                            data: data,
                            componentName: 'HomeUploading',
                        });

                    }}/>;

        }
    }

    render() {

        return (

            <div className={'app-container'}>
                <Header/>
                <div className={'app-content'}>

                    {this._renderComponent()}

                </div>
            </div>
        )
    }
}


export default Home;
