import React, {Component} from 'react';
import {getFileDownloads} from '../helpers/download'
import _ from 'lodash'
import {betterNumber} from "../helpers/index";
import {apiUrl} from "../config";
import {history} from "../history";

class View extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fileInfo: null
        };
        this.getFileSize = this.getFileSize.bind(this);
    }

    componentWillMount() {
        const {match} = this.props;
        const paramId = _.get(match, 'params.id');
        getFileDownloads(paramId).then((res) => {
            this.setState({
                fileInfo: _.get(res, 'data')
            })
        }).catch((err) => {
            console.log("An error Occured" + err)
        })
    }

    render() {
        const {fileInfo} = this.state;

        const files = _.get(fileInfo, 'files', []);
        const totalSize = this.getFileSize();
        const postId = _.get(fileInfo, '_id', null);
        return (
            <div className={'app-page-download'}>
                <div className={'app-top-header'}>
                    <h1 onClick={() => {

                        history.push('/')

                    }}><i className={'icon-paper-plane'}/> File Fly</h1>
                </div>
                <div className={'app-card app-card-download'}>

                    <div className={'app-card-content'}>
                        <div className={'app-card-content-inner'}>
                            <div className={'app-download-icon'}>
                                <i className={'icon-download'}/>
                            </div>

                            <div className={'app-download-message app-text-center'}>
                                <h2>Ready to download</h2>
                                <ul>
                                    <li>{files.length} files</li>
                                    <li>{totalSize}</li>
                                    <li>Expires in 30 days</li>
                                </ul>
                            </div>

                            <div className={'app-download-file-list'}>
                                {
                                    files.map((file, index) => {

                                        return (
                                            <div key={index} className={'app-download-file-list-item'}>
                                                <div className={'filename'}>{_.get(file, 'originalName')}</div>
                                                <div className={'download-action'}><a
                                                    href={`${apiUrl}/download/${_.get(file, '_id')}`}>Download</a></div>
                                            </div>)
                                    })
                                }


                            </div>

                            <div className={'app-download-actions app-form-actions'}>

                                <a href={`${apiUrl}/posts/${postId}/download`} className={'app-button primary'}>Download
                                    All</a>
                                <button className={'app-button'} type={'button'}>Share</button>
                            </div>
                        </div>


                    </div>

                </div>
            </div>
        )
    }

    getFileSize() {
        const {fileInfo} = this.state;

        let total = 0;
        const files = _.get(fileInfo, 'files', []);

        _.each(files, (file) => {

            total = total + _.get(file, 'size', 0);
        });

        return betterNumber(total);
    }
}

export default View;
