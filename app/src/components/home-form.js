import React, {Component} from 'react'
import _ from 'lodash'
import classNames from 'classnames'
// import {upload} from '../helpers/upload'
import PropTypes from 'prop-types'

class HomeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {

            form: {
                //initialize the form state variables
                files: [],
                to: 'samfred@test.com',
                from: 'jessicajones@test.com',
                message: 'Hey Sam'
            },

            errors: {
                to: null,
                from: null,
                message: null,
                files: null,
            }
        };

        //register the method to this class
        this._onTextChange = this._onTextChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._formValidation = this._formValidation.bind(this);
        this._onFileAdded = this._onFileAdded.bind(this);
        this._onFileRemove = this._onFileRemove.bind(this)


    }

    _onFileRemove(key) {
        //declare and initialize files variable to the form state variables
        let {files} = this.state.form;
        //using the key remove the index from the file array
        files.splice(key, 1);
        //set new state of files state variables
        this.setState({
            form: {
                ...this.state.form,
                files: files
            }
        })


    }

    _onFileAdded(event) {
        /*load ash allows us to use the _get func,
        sames as files = this.state.form.files
        */
        let files = _.get(this.state, 'form.files', []);
        // loop through the event.target.files array and append each item to the files array
        _.each(_.get(event, 'target.files', []), (file) => {
            files.push(file);
        });
        //set new state of files state variables
        this.setState({

            form: {
                ...this.state.form,
                files: files,
            }
        }, () => {

            this._formValidation(['files'], (isValid) => {


            });
        });


    }

    _isEmail(emailAddress) {
        //Regex to check if email is correct
        const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

        return emailRegex.test(emailAddress);
    }

    _formValidation(fields = [], callback = () => {
    }) {

        let {form, errors} = this.state;
        const validations = {
            from: [
                {
                    errorMessage: 'From is required.',
                    isValid: () => {
                        return form.from.length;
                    }
                },
                {
                    errorMessage: 'Email is not valid.',
                    isValid: () => {
                        return this._isEmail(form.from);
                    }
                }
            ],
            to: [
                {
                    errorMessage: 'To is required.',
                    isValid: () => {
                        return form.to.length;
                    }
                },
                {
                    errorMessage: 'Email is not valid.',
                    isValid: () => {
                        return this._isEmail(form.to);
                    }
                }
            ],
            files: [
                {
                    errorMessage: 'File is required.',
                    isValid: () => {
                        return form.files.length;
                    }
                }
            ]
        }

        _.each(fields, (field) => {


            let fieldValidations = _.get(validations, field, []); // validations[field];


            errors[field] = null;


            _.each(fieldValidations, (fieldValidation) => {


                const isValid = fieldValidation.isValid();

                if (!isValid) {
                    errors[field] = fieldValidation.errorMessage;
                }

            });


        });


        this.setState({
            errors: errors
        }, () => {

            let isValid = true;

            _.each(errors, (err) => {

                if (err !== null) {
                    isValid = false;
                }
            });
            return callback(isValid);

        });


    }

    _onSubmit(event) {
        event.preventDefault();

        this._formValidation(['from', 'to', 'files'], (isValid) => {


            if (isValid) {
                // the form is valid and ready to submit.

                const data = this.state.form;
                console.log("submitted")

            }
        });
    }

    _onTextChange(event) {

        let {form} = this.state;

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        form[fieldName] = fieldValue;
        this.setState({form: form});

    }


    render() {

        //declare and initialize form and error variables to the state variables
        const {form, errors} = this.state;
        const {files} = form;

        return (
            <div className={'app-card'}>
                <form onSubmit={this._onSubmit}>
                    <div className={'app-card-header'}>
                        <div className={'app-card-header-inner'}>


                            {
                                //if there is more than or one file uploaded then show the file(s) else hide
                                files.length ?
                                    <div className={'app-files-selected'}>
                                        {
                                            //Loop through the files array and render(display)them
                                            files.map((file, index) => {
                                                return (
                                                    <div key={index} className={'app-files-selected-item'}>
                                                        <div className={'filename'}>{file.name}</div>
                                                        <div className={'file-action'}>
                                                            <button onClick={() => this._onFileRemove(index)}
                                                                    type={'button'} className={'app-file-remove'}>X
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div> : null
                            }

                            <div className={classNames('app-file-select-zone', {'error': _.get(errors, 'files')})}>
                                <label htmlFor={'input-file'}>
                                    <input onChange={this._onFileAdded} id={'input-file'} type="file" multiple={true}/>
                                    {
                                        files.length ? <span className={'app-upload-description text-uppercase'}>Add more files</span> :
                                            <span>
                                                <span className={'app-upload-icon'}><i
                                                    className={'icon-picture-streamline'}/> </span>
                                                <span className={'app-upload-description'}>Drag and drop your files here.</span>
                                            </span>
                                    }
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={'app-card-content'}>
                        <div className={'app-card-content-inner'}>
                            <div className={classNames('app-form-item', {'error': _.get(errors, 'to')})}>
                                <label htmlFor={'to'}>Send to</label>
                                <input onChange={this._onTextChange} value={form.to} name={'to'}
                                       placeholder={_.get(errors, 'to') ? _.get(errors, 'to') : 'Email address'}
                                       type={'text'} id={'to'}/>
                            </div>

                            <div className={classNames('app-form-item', {'error': _.get(errors, 'from')})}>
                                <label htmlFor={'from'}>From</label>
                                <input value={_.get(form, 'from')} onChange={this._onTextChange} name={'from'}
                                       placeholder={_.get(errors, 'from') ? _.get(errors, 'from') : 'Your email address'}
                                       type={'text'} id={'from'}/>
                            </div>


                            <div className={'app-form-item'}>
                                <label htmlFor={'message'}>Message</label>
                                <textarea value={_.get(form, 'message', '')} onChange={this._onTextChange}
                                          placeholder={'Add a note (optional)'}
                                          id={'message'} name={'message'}/>
                            </div>


                            <div className={'app-form-actions'}>
                                <button type={'submit'} className={'app-button primary'}>Send</button>
                            </div>


                        </div>
                    </div>
                </form>
            </div>
        )
    }
}


// HomeForm.propTypes = {
//     onUploadBegin: PropTypes.func,
//     onUploadEvent: PropTypes.func
//
// };

export default HomeForm;