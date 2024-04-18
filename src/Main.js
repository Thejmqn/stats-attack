import './App.css';
import saveAs from 'file-saver';
import {useState} from 'react';
import axios from 'axios';
import Header from './Header.js';
import Instructions from './Instructions.js';
import ImageBanner from './ImageBanner.js'

function App() {
    const [uploadFile, setUploadFile] = useState(null);
    const [footerNote, setFooterNote] = useState("No file uploaded.");
    const [downloadBlob, setDownloadBlob] = useState(null);
    const [downloadNote, setDownloadNote] = useState("Click me after uploading a file!");

    const onFileUpload = e => {
        const file = e.target.files;

        if (file && file.length > 0) {
            setUploadFile(file[0]);
            setFooterNote("Uploaded file" + file[0].name);
        }
    }

    const sendFile = e => {
        e.preventDefault();
        const ext = uploadFile.name.split('.').pop();

        if (ext !== "csv") {
            setFooterNote("Invalid file format, upload a .csv file");
            return;
        }

        setFooterNote("Uploaded file " + uploadFile.name);

        let formData = new FormData();
        formData.append("data", uploadFile, "csvfile.csv");
        console.log(formData);

        axios.post(`http://localhost:8080/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(res => {
                const blob = new Blob([res.data], {type: 'text/plain;charset=utf-8'});
                setDownloadBlob(blob);

            })
            .catch(err => {
                console.log("Upload failed with error: " + err);
            });
    }

    const downloadFile = e => {
        e.preventDefault();
        if (downloadBlob !== null) {
            saveAs(downloadBlob, "download.csv");
        }

    }

    return (
        <div>
            <Header/>

            <ImageBanner/>

            <Instructions/>
            <div className="fileHandling">
                <div className="fileUpload">
                    <h1>UPLOAD FILE</h1>
                    <label htmlFor="file-upload" className="file-button">File Upload</label>
                    <input id="file-upload" type="file" accept=".csv" onChange={e => onFileUpload(e)}/>
                    <button onClick={e => sendFile(e)}>Upload</button>
                    <h3>{footerNote}</h3>
                </div>
                <div className="fileDownload">
                    <h2 id="downloadButton_" onClick={e => downloadFile(e)}>Download File</h2>
                    <p>{downloadNote}</p>
                </div>
            </div>

            <div className='footer'>
            </div>
        </div>
    );
}

export default App;
