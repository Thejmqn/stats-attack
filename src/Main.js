import './App.css';
import Header from './Header.js';
import Instructions from './Instructions.js';
import ImageBanner from './ImageBanner.js'
import FileHandling from "./FileHandling";
import CalendarSetup from "./CalendarSetup.js";

function App() {
    return (
        <div>
            <Header/>

            <ImageBanner/>

            <CalendarSetup/>

            <Instructions/>

            <FileHandling/>

            <div className="footer"></div>
        </div>
    );
}

export default App
