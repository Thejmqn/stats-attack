import './App.css';
import BrownLibrary from './Images/BrownLibrary.png'
import ShannonLibrary from './Images/ShannonLibrary.png'
import ClemonsLibrary from './Images/ClemonsLibrary.png'

function ImageBanner() {
    return (
        <>
            <div className='image-banner'>

                <img src={BrownLibrary} alt='Brown' />

                <img src={ShannonLibrary} alt='Shannon'/>

                <img src={ClemonsLibrary} alt='Clemons' />

            </div>
        </>
    )

}

export default ImageBanner;