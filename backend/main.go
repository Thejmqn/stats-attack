package main

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"github.com/dimchansky/utfbom"
	"github.com/gocarina/gocsv"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type outlookData struct {
	Subject            string `csv:"Subject"`
	StartDate          string `csv:"Start Date"`
	StartTime          string `csv:"Start Time"`
	EndDate            string `csv:"End Date"`
	EndTime            string `csv:"End Time"`
	AllDayEvent        string `csv:"All day event"`
	ReminderOn         string `csv:"Reminder on/off"`
	ReminderDate       string `csv:"Reminder Date"`
	ReminderTime       string `csv:"Reminder Time"`
	MeetingOrganizer   string `csv:"Meeting Organizer"`
	RequiredAttendees  string `csv:"Required Attendees"`
	OptionalAttendees  string `csv:"Optional Attendees"`
	MeetingResources   string `csv:"Meeting Resources"`
	BillingInformation string `csv:"Billing Information"`
	Categories         string `csv:"Categories"`
	Description        string `csv:"Description"`
	Location           string `csv:"Location"`
	Mileage            string `csv:"Mileage"`
	Priority           string `csv:"Priority"`
	Private            string `csv:"Private"`
	Sensitivity        string `csv:"Sensitivity"`
	ShowTimeAs         string `csv:"Show time as"`
}

type libraryData struct {
	StartDate              string `csv:"State Date"`
	InternalNotes          string `csv:"Internal Notes"`
	EnteredBy              string `csv:"Entered By"`
	AdditionalNotes        string `csv:"Additional Notes"`
	AdditionalStaff        string `csv:"Additional Staff"`
	AdditionalUsers        string `csv:"Additional Users"`
	ArlInteractionType     string `csv:"ARL Interaction Type"`
	AttendeeType           string `csv:"Attendee Type"`
	DateOfTheInteraction   string `csv:"Date of the Interaction"`
	Department             string `csv:"Department"`
	Description            string `csv:"Description"`
	GrantRelated           string `csv:"Grant Related?"`
	Medium                 string `csv:"Medium"`
	PrePostTime            string `csv:"Pre-post-time"`
	PrimaryUserName        string `csv:"Primary User Name"`
	PrimaryUserComputingID string `csv:"Primary User's Computing ID"`
	RdeSneGroup            string `csv:"RDS+SNE Group"`
	Referral               string `csv:"Referral"`
	School                 string `csv:"School"`
	SessionDuration        string `csv:"Session Duration"`
	SourceSoftware         string `csv:"Source/Software"`
	Staff                  string `csv:"Staff"`
	Topic                  string `csv:"Topic"`
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/testBackend/{input}", inputHandler).Methods(http.MethodGet)
	router.HandleFunc("/upload", uploadHandler).Methods(http.MethodPost)
	router.Use(mux.CORSMethodMiddleware(router))
	fmt.Println("Server started on port 8080")
	log.Fatal(http.ListenAndServe("localhost:8080", router))
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		return
	}
	file, _, err := r.FormFile("data")
	fileName := uuid.New().String() + ".csv"
	secondFileName := uuid.New().String() + ".csv"
	if err != nil {
		log.Fatal(err)
	}
	enableCORS(&w)

	csvFile, err := os.Create(fileName)
	if err != nil {
		log.Fatal(err)
	}

	_, copyErr := io.Copy(csvFile, file)
	if copyErr != nil {
		log.Fatal(err)
	}
	fmt.Println("Received data, saving as " + fileName)

	readFile, err := os.OpenFile(fileName, os.O_RDONLY, os.ModePerm)
	if err != nil {
		log.Fatal(err)
	}

	var dataList []*outlookData
	gocsv.SetCSVReader(func(in io.Reader) gocsv.CSVReader {
		r := csv.NewReader(in)
		r.LazyQuotes = true
		return r
	})
	bodyWithoutBom, err := ioutil.ReadAll(utfbom.SkipOnly(bufio.NewReader(readFile)))
	if err := gocsv.UnmarshalBytes(bodyWithoutBom, &dataList); err != nil {
		panic(err)
	}
	updatedRecords := handleCSV(dataList)

	writeFile, err := os.Create(secondFileName)
	err = gocsv.MarshalFile(&updatedRecords, writeFile)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "text/csv")
	w.Header().Add("Content-Disposition", `attachment; filename="data.csv"`)
	b, err := ioutil.ReadFile(secondFileName)
	if err != nil {
		panic(err)
	}
	_, err = w.Write(b)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Successfully sent processed data, deleting " + fileName)

	file.Close()
	csvFile.Close()
	readFile.Close()
	writeFile.Close()
	err = os.Remove(fileName)
	if err != nil {
		log.Fatal(err)
	}
	err = os.Remove(secondFileName)
	if err != nil {
		log.Fatal(err)
	}
}

func handleCSV(data []*outlookData) []*libraryData {
	var newData []*libraryData
	for _, outlookInstance := range data {
		var libraryInstance libraryData

		//edit here
		libraryInstance.StartDate = outlookInstance.StartDate
		//end here

		newData = append(newData, &libraryInstance)
	}
	return newData
}

func inputHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	res := vars["input"] + " Hello from backend"
	fmt.Println("Received token: " + vars["input"])
	enableCORS(&w)
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(map[string]string{"message": res})
	if err != nil {
		log.Fatal(err)
	}
}

func enableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}
