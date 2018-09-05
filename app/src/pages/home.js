import React, {Component} from 'react'
import Header from '../components/header'
import HomeForm from "../components/home-form";
import HomeUploading from '../components/home-uploading'
<<<<<<< HEAD

=======
import HomeUploadSent from "../components/home-upload-sent";
import _ from 'lodash';
>>>>>>> 00f8dac4066e9a8cf569914c132df6c330918499

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
<<<<<<< HEAD


=======
            case 'HomeUploadSent':

                return (
                    <HomeUploadSent onSendAnotherFile={() => {
                        this.setState({
                            componentName: 'HomeForm'
                        })
                    }} data={data}/>
                );
>>>>>>> 00f8dac4066e9a8cf569914c132df6c330918499

            default:
                return <HomeForm
                    /*Make a call to func onUploadEvent on hoe form , hence passing the props from child to parent */
                    onUploadEvent={(event) => {
<<<<<<< HEAD

                        this.setState({
                                uploadEvent: event,
                                componentName: 'HomeUploading'
                            });
=======
                        let data = this.state.data;

                        if (_.get(event, 'type') === 'success') {

                            data = _.get(event, 'payload');
                        }
                        this.setState({
                            data: data,
                            uploadEvent: event,
                            componentName: (_.get(event, 'type') === 'success') ? 'HomeUploadSent' : this.state.componentName,
                        });
>>>>>>> 00f8dac4066e9a8cf569914c132df6c330918499
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
