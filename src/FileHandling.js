import axios from "axios";
import saveAs from 'file-saver';
import {useState} from 'react';

function FileHandling() {
    const [uploadFile, setUploadFile] = useState(null);
    const [downloadBlob, setDownloadBlob] = useState(null);
    const [fileStatus, setFileStatus] = useState("Select a file to upload");

    const onFileUpload = e => {
        e.preventDefault();
        const file = e.target.files;

        if (file && file.length > 0) {
            setUploadFile(file[0]);
            setFileStatus("Selected file" + file[0].name);
            setDownloadBlob(null);
        }
    }

    const sendFile = e => {
        e.preventDefault();
        const ext = uploadFile.name.split('.').pop().toLowerCase();

        if (ext !== "csv") {
            setFileStatus( "Invalid file format, select a .csv file");
            return;
        }

        let formData = new FormData();
        formData.append("data", uploadFile, "csvfile.csv");
        console.log(formData);

        axios.post(`http://localhost:8080/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(res => {
                const blob = new Blob([res.data], {type: 'text/plain;charset=utf-8'});
                setDownloadBlob(blob);
                setUploadFile(null);
                setFileStatus("Uploaded and processed file " + uploadFile.name);

            })
            .catch(err => {
                console.log("Upload failed with error: " + err);
                setFileStatus("Upload failed, try again.");
            });
    }

    const downloadFile = e => {
        e.preventDefault();
        if (downloadBlob !== null) {
            saveAs(downloadBlob, "download.csv");
        }
    }

    return (
        <div className="file-handling">
            <h3 className="section-header">------------------------- File Upload -------------------------</h3>
            <h2 id="file-status">{fileStatus}</h2>
            <div className="file-button-list">
                <label htmlFor="file-upload" className="file-button">Select File</label>
                <input id="file-upload" type="file" accept=".csv" onChange={e => onFileUpload(e)}/>

                {uploadFile !== null &&
                    <button className="file-button" onClick={e => sendFile(e)}>Upload File</button>
                }

                {downloadBlob !== null &&
                    <button className="file-button" onClick={e => downloadFile(e)}>Download File</button>
                }
            </div>
        </div>
    );
}

export default FileHandling;
