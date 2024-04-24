import './App.css';

function Instructions() {
    return (
        <>
            <div className = 'instructions site-section'>
              <h3 className = 'section-header'>-------------------------- Instructions --------------------------</h3>

              <div className = 'instruction-point-list'>

                <div className = 'instruction-point'>
                    <h4>1. Export Outlook Calendar</h4>
                    <ul>
                        <li>Open the Outlook App (cannot be done on browser)</li>
                        <li>Click File {'>'} Open & Export {'>'} Import/Export </li>
                        <li>In the wizard: Click export to a file {'>'} Comma Separated Values, then choose your calendar</li>
                        <li>Choose where to store the .csv file with desired date range and finish</li>
                    </ul>
                </div>

                <div className = 'instruction-point'>
                    <h4>2. Upload the .csv file</h4>
                    <ul>
                        <li>Click the "Select File" button bellow</li>
                        <li>Choose the .csv file downloaded from step 1</li>
                        <li>Click the "Upload File" button that appears after selecting a file</li>
                    </ul>
                </div>


                <div className = 'instruction-point'>
                    <h4 style ={{fontFamily: 'Courier New'}}>3. Download new .csv file</h4>
                    <ul>
                        <li>Click the "Download File" button below</li>
                        <li>Upload the new .csv file to the Library's webform</li>
                        <li>Enjoy watching the fields automatically filled!</li>
                    </ul>
                </div>

              </div>

            </div>
        </>
    )
}

export default Instructions
