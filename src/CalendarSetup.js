import './App.css';
import CalendarExample from "./Images/CalendarExample.png"

function CalendarSetup() {
    return (
        <div className="site-section calendar-setup">
            <h3 className="section-header">--------------------- Calendar Setup ----------------------</h3>

            <div className="setup-main-container">
                <div className="setup-point">
                    <h4>General Guidelines:</h4>
                    <ul>
                        <li>Categorize the events you would like to be processed in the "Purple Category" when creating
                            events in the calendar
                        </li>
                        <li>Fill all the fields for each event</li>
                        <li>For "location" of event for interactions not in person, specify according
                            to the "Medium" of the web form
                        </li>
                    </ul>
                </div>

                <div className="setup-hor-container">
                    <div className="setup-ver-container">
                        <div className="setup-point left-side">
                            <h4>Event Description:</h4>
                            <ul>
                                <li>
                                    <p>To fill out all fields in the form, the Event Description needs to contain the
                                        following input in the format:<br/><b> &#123; School &#125; , &#123; ARL
                                            Interaction
                                            Type &#125; , &#123; RDS+SNE Group &#125; (&#123; Topic
                                            &#125;) , &#123; Pre-post time &#125;</b></p>
                                </li>
                                <li>
                                    <p><b>School, ARL Interaction Type, and RDS+SNE Group</b> can be abbreviated, look
                                        to the right
                                        for lists of abbreviations.
                                    </p>
                                </li>
                                <li>
                                    <p><b>For Topic</b> is based on RDS+SNE Group. Given the choice for RDS+SNE group,
                                        you
                                        pick one or more of the options below:</p>
                                    <ul>
                                        <li><p><b>Data Discovery:</b> data discovery, acquisition request, restricted
                                            data;
                                        </p>
                                        </li>
                                        <li><p><b>Research Data Management:</b> DM plan, data archiving, data storage,
                                            data
                                            security, data management;</p></li>
                                        <li><p><b>StatLab:</b> data wrangling, visualization, statistical methods,
                                            computational
                                            methods, software/programing language use;</p></li>
                                        <li><p><b>Subject Librarianship:</b> literature review, libguides, databases,
                                            Zotero,
                                            copyright, curriculum;</p></li>
                                        <li><p><b>Research Software:</b> install, renewal, access/registration/upgrade,
                                            purchase,
                                            software use;</p></li>
                                    </ul>
                                </li>
                                <li>
                                    <p><b>Pre-post time:</b> Like session duration, it should be entered as nearest
                                        number
                                        of
                                        quarter hours (it is time spent preparing for the interaction):</p>
                                </li>
                            </ul>


                        </div>
                        <img src={CalendarExample} alt="Example Outlook Event" className="setup-point left-side"/>
                    </div>

                    <div className="setup-ver-container right-side">
                        <div className="setup-point ">
                            <h4>Abbreviations (Case Insensitive):</h4>
                            <ul>
                                <li>
                                    <p>School</p>
                                    <ul>
                                        <li><p>Architecture -> ARCH</p></li>
                                        <li><p>Arts & Sciences: Humanities -> ASH</p></li>
                                        <li><p>Arts & Sciences: Interdisciplinary -> ASI</p></li>
                                        <li><p>Arts & Sciences: Sciences -> ASS</p></li>
                                        <li><p>Arts & Sciences: Social Sciences -> ASSS</p></li>
                                        <li><p>Batten (Leadership) -> Batten</p></li>
                                        <li><p>Commerce -> Commerce</p></li>
                                        <li><p>Community -> Community</p></li>
                                        <li><p>Darden -> Darden</p></li>
                                        <li><p>Data Sciences -> DS</p></li>
                                        <li><p>Education -> EDU</p></li>
                                        <li><p>Engineering -> ENGR</p></li>
                                        <li><p>Law -> Law</p></li>
                                        <li><p>Medicine -> Medicine</p></li>
                                        <li><p>Nursing -> Nursing</p></li>
                                        <li><p>School of Continuing and Professional Studies -> SCPS</p></li>
                                        <li><p>UVA affiliated -> Affiliated</p></li>
                                    </ul>
                                </li>
                                <li>
                                    <p>ARL Interaction Types:</p>
                                    <ul>
                                        <li><p>Group Presentation -> Group</p></li>
                                        <li><p>Other -> Other</p></li>
                                        <li><p>Reference transaction -> Reference</p></li>
                                    </ul>
                                </li>


                                <li>
                                    <p>RDS+SDE Group:</p>
                                    <ul>
                                        <li><p>Data Discovery -> DD</p></li>
                                        <li><p>Research Data Management -> RDM</p></li>
                                        <li><p>Research Librarianship -> RL</p></li>
                                        <li><p>Research Software Support -> RSS</p></li>
                                        <li><p>UVA Research Computing -> URC</p></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <h4 id="example-caption">&#60;-- An example Calendar Event</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarSetup;