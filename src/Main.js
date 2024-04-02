import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { TextField } from '@mui/material';

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
    <div className="App">
         <TextField label="Input here" variant="outlined" value ={inputText} onChange={v => setInputText(v.target.value)}/>
        <button onClick={getBackend}>Test Query</button>
        <p>{displayText}</p>
    </div>
  );
}

export default App;
