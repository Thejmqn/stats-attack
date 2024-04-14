import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { TextField } from '@mui/material';
import Header from './Header.js';
import Instructions from './Instructions.js';
import ImageBanner from './ImageBanner.js'
import { upload } from '@testing-library/user-event/dist/upload.js';


function App() {
  const [inputText, setInputText] = useState("asdasd");
  const [displayText, setDisplayText] = useState("");
  const [uploadFile, setUploadFile] = useState(null);

  const onFileUpload = e => {
      const file = e.target.files;
      if (file && file.length > 0) {
        setUploadFile(file[0]);
      }
  }

  const getBackend = () => {
    axios.get(`http://localhost:8080/testBackend/${inputText}`)
    .then(res => {
      setDisplayText(res.data.message);
    })
    .catch(err => {
      console.log(err);
      setInputText("Could not retrieve data: " + err);
    });
  }

  const sendFile = () => {
    let formData = new FormData();
    formData.append("data", uploadFile, "csvfile.csv");
    console.log(formData);

    axios.post(`http://localhost:8080/upload`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
    .then (res => {
      console.log(res);
    })
    .catch(err => {
      console.log("Upload failed with error: " + err);
    });
  }

  return (
    <div>
      <Header />
      
      <ImageBanner />

      <Instructions />

      <div className="fileUpload">
        <form>
          <h1>UPLOAD FILE</h1>
          <input type="file" accept=".csv" onChange={e => onFileUpload(e)}/>
          <button type="submit">Upload</button>
        </form>
      </div>
      
      <div className='footer'>
        <h1>{uploadFile == null ? "No file uploaded." : "You uploaded: " + uploadFile.name}</h1>
        <button onClick={sendFile}>Test File Upload</button>
      </div>

    </div>
  );
}

export default App;
