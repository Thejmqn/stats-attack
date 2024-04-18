import axios from "axios";
import saveAs from 'file-saver';
import {Component} from 'react';

class FileHandling extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadFile: null,
            downloadBlob: null,
            fileStatus: "No file selected."
        }
    }

    render() {
        const onFileUpload = e => {
            e.preventDefault();
            const file = e.target.files;

            if (file && file.length > 0) {
                this.setState({uploadFile: file[0]});
                this.setState({fileStatus: "Selected file" + file[0].name});
                this.setState({downloadBlob: null});
            }
        }

        const sendFile = e => {
            e.preventDefault();
            const ext = this.state.uploadFile.name.split('.').pop();

            if (ext !== "csv") {
                this.setState({fileStatus: "Invalid file format, select a .csv file"});
                return;
            }

            let formData = new FormData();
            formData.append("data", this.state.uploadFile, "csvfile.csv");
            console.log(formData);

            axios.post(`http://localhost:8080/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(res => {
                    const blob = new Blob([res.data], {type: 'text/plain;charset=utf-8'});
                    this.setState({downloadBlob: blob});
                    this.setState({uploadFile: null});
                    this.setState({fileStatus: "Uploaded and processed file " + this.state.uploadFile.name});

                })
                .catch(err => {
                    console.log("Upload failed with error: " + err);
                    this.setState({fileStatus: "Upload failed, try again."});
                });
        }

        const downloadFile = e => {
            e.preventDefault();
            if (this.state.downloadBlob !== null) {
                saveAs(this.state.downloadBlob, "download.csv");
            }
        }

        return (
            <div className="file-handling">
                <h3>------------------------- File Upload -------------------------</h3>
                <div className="file-button-list">
                    <label htmlFor="file-upload" className="file-button">Select File</label>
                    <input id="file-upload" type="file" accept=".csv" onChange={e => onFileUpload(e)}/>

                    {this.state.uploadFile !== null &&
                        <button className="file-button" onClick={e => sendFile(e)}>Upload File</button>
                    }

                    {this.state.downloadBlob !== null &&
                        <button className="file-button" onClick={e => downloadFile(e)}>Download File</button>
                    }
                </div>
                <h2 id="file-status">{this.state.fileStatus}</h2>
            </div>
        );
    }
}

export default FileHandling;
