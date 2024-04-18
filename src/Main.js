import './App.css';
import React from 'react';
import Header from './Header.js';
import Instructions from './Instructions.js';
import ImageBanner from './ImageBanner.js'
import FileHandling from "./FileHandling";

function App() {
    return (
        <div>
            <Header/>

            <ImageBanner/>

            <Instructions/>

            <FileHandling/>

            <div className="footer"></div>
        </div>
    );
}

export default App;
