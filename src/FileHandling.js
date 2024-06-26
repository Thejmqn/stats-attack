import axios from "axios";
import saveAs from 'file-saver';
import {useState} from 'react';

function FileHandling() {
    const [uploadFile, setUploadFile] = useState(null);
    const [downloadBlob, setDownloadBlob] = useState(null);
    const [fileStatus, setFileStatus] = useState("Select a file to upload");
    const [textInputs, setTextInputs] = useState({firstName: "First Name:", lastName: "Last Name:", id: "Computing ID:"})

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
        formData.append("firstName", textInputs.firstName);
        formData.append("lastName", textInputs.lastName);
        formData.append("computingID", textInputs.id);
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
        <div className="file-handling site-section">
            <h3 className="section-header">------------------------- File Upload -------------------------</h3>
            <h2 id="file-status">{fileStatus}</h2>
            <input type="text" value={textInputs.firstName} onChange={e => setTextInputs({...textInputs, firstName: e.target.value})}/>
            <input type="text" value={textInputs.lastName} onChange={e => setTextInputs({...textInputs, lastName: e.target.value})}/>
            <input type="text" value={textInputs.id} onChange={e => setTextInputs({...textInputs, id: e.target.value})}/>

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
