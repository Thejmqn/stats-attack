import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { TextField } from '@mui/material';
import Header from './Header.js';
import Instructions from './Instructions.js';
import ImageBanner from './ImageBanner.js'


function App() {
  const [inputText, setInputText] = useState("asdasd");
  const [displayText, setDisplayText] = useState("");

  const getBackend = () => {
    axios.get(`http://localhost:8080/testBackend/${inputText}`)
    .then(res => {
      setDisplayText(res.data.message);
    })
    .catch(err => {
      console.log(err);
      setInputText("Could not retrieve data: " + err);
    })  
  

  }

  return (
    <div>
      <Header />
      
      <ImageBanner />

      <Instructions />

      <div className="fileUpload">
        <form>
          <h1>UPLOAD FILE</h1>
          <input type="file" />
          <button type="submit">Upload</button>
        </form>
      </div>
      
      <div className='footer'>
        <h1></h1>

      </div>

    </div>
  );
}

export default App;
