import './App.css';
import BrownLibrary from './BrownLibrary.png'
import ShannonLibrary from './ShannonLibrary.png'
import ClemonsLibrary from './ClemonsLibrary.png'

function ImageBanner() {
    return (
        <>
            <div className='imageBanner'>

                <img src={BrownLibrary} alt='Brown' />

                <img src={ShannonLibrary} alt='Shannon'/>

                <img src={ClemonsLibrary} alt='Clemons' />

            </div>
        </>
    )

}

export default ImageBanner;