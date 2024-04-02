import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { TextField } from '@mui/material';

function App() {
	const [inputText, setInputText] = useState("Input filepath");
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
				<h1 className="title">Stats Attack: File Upload</h1>

				<div className='Input'>
					<TextField label="Input-here" variant="outlined" value ={inputText} onChange={v => setInputText(v.target.value)}/>
					<button onClick={getBackend}>Test Query</button>
					<p>{displayText}</p>
				</div>

				<div className="Tutorials">
					<div className='Tutorial-One'>
						<h3>Step 1: Download your Outlook File</h3>
						<p>Lorem ipsum</p>
					</div>

					<div className='Tutorial-One'>
						<h3>Step 2: Upload the file here:</h3>
						<p>Lorem ipsum</p>
					</div>

					<div className='Tutorial-Three'>
						<h3>Step 3: Download the file and upload to the form</h3>
						<p>Lorem ipsum</p>
					</div>
				</div>
		</div>
	);
}

export default App;
