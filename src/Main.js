import './App.css';
import { useState } from 'react';
import axios from 'axios';
import Header from './Header.js';
import Instructions from './Instructions.js';
import ImageBanner from './ImageBanner.js'

function App() {
  const [uploadFile, setUploadFile] = useState(null);
  const [footerNote, setFooterNote] = useState("No file uploaded.");

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
<<<<<<< HEAD
          <button type="submit">Upload</button>
=======
          <button onClick={e => sendFile(e)}>Upload</button>
          <h3>{footerNote}</h3>
>>>>>>> de2eff38db59f20d9430f666caf122dbe842bdac
        </form>
      </div>
      
      <div className='footer'>
      </div>
    </div>
  );
}

export default App;
