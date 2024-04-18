import './App.css';

function Instructions() {
    return (
        <>
            <div className = 'instructions'>
              <h3 id = 'instructionHeader'>-------------------------- Instructions --------------------------</h3>

              <div className = 'instructionPoints'>

                <div className = 'pointColumn'>
                    <h4 style ={{fontFamily: 'Courier New'}}>Guidelines for calendar events:</h4>
                    <ul>
                        <li>Categorize the events you would like to be processed in the "Purple Category" when creating events in the calendar</li>
                        <li>Fill all the fields for each event</li>
                        <li>Special instructions: For "location" of event for interactions not in person, specify according to the "Medium" of the web form</li>
                    </ul>

                </div>

                <div className = 'pointColumn'>
                    <h4 style ={{fontFamily: 'Courier New'}}>1. Export Outlook Calendar</h4>
                    <ul>
                        <li>Open the Outlook App (cannot be done on browser)</li>
                        <li>Click File {'>'} Open & Export {'>'} Import/Export </li>
                        <li>In the wizard: Click export to a file {'>'} Comma Separated Values, then choose your calendar</li>
                        <li>Choose where to store the .csv file with desired date range and finish</li>
                    </ul>
                </div>

                <div className = 'pointColumn'>
                    <h4 style ={{fontFamily: 'Courier New'}}>2. Upload the .csv file</h4>
                    <ul>
                        <li>Click on the "upload" button bellow</li>
                        <li>Choose the .csv file downloaded from step 1</li>
                    </ul>
                </div>


                <div className = 'pointColumn'>
                    <h4 style ={{fontFamily: 'Courier New'}}>3. Download new .csv file</h4>
                    <ul>
                        <li>Click the "download" button below</li>
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
