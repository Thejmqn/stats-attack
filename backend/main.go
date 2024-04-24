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
	"regexp"
	"strings"
	"time"
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
	DateOfTheInteraction   string `csv:"Date of the Interaction"`
	Staff                  string `csv:"Staff"`
	AdditionalStaff        string `csv:"Additional Staff"`
	PrimaryUserComputingID string `csv:"Primary User's Computing ID"`
	PrimaryUserName        string `csv:"Primary User Name"`
	AdditionalUsers        string `csv:"Additional Users"`
	AttendeeType           string `csv:"Attendee Type"`
	School                 string `csv:"School"`
	Department             string `csv:"Department"`
	ArlInteractionType     string `csv:"ARL Interaction Type"`
	SessionDuration        string `csv:"Session Duration"`
	PrePostTime            string `csv:"Pre-post-time"`
	RdeSneGroup            string `csv:"RDS+SNE Group"`
	Topic                  string `csv:"Topic"`
	Medium                 string `csv:"Medium"`
	Description            string `csv:"Description"`
	Referral               string `csv:"Referral"`
	GrantRelated           string `csv:"Grant Related?"`
	SourceSoftware         string `csv:"Source/Software"`
	AdditionalNotes        string `csv:"Additional Notes"`
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
	const ExportCategory = "Purple category"
	for _, outlookInstance := range data {
		if outlookInstance.Categories == ExportCategory {
			libraryInstance := mapCategories(outlookInstance)
			newData = append(newData, &libraryInstance)
		}
	}
	return newData
}

func mapCategories(input *outlookData) libraryData {
	var output libraryData
	output.StartDate = input.StartDate
	output.Topic = input.Subject
	output.InternalNotes = ""
	reName, err := regexp.Compile(`^([^,]+),\s*([^ ]+)`)
	if err != nil {
		log.Fatal(err)
	}
	name := reName.FindString(input.MeetingOrganizer)
	if name == "" {
		output.EnteredBy = "NOT SPECIFIED"
	} else {
		output.EnteredBy = name
	}
	output.DateOfTheInteraction = input.StartDate
	digitFinder, err := regexp.Compile(`\(([^)]+)\)`)
	if err != nil {
		log.Fatal(err)
	}
	librarianDigits := digitFinder.FindString(input.MeetingOrganizer)
	if err != nil {
		log.Fatal(err)
	}
	userDigits := digitFinder.FindString(input.RequiredAttendees)
	if userDigits == "" || len(userDigits) < 3 {
		output.PrimaryUserComputingID = "INVALID ID"
	} else {
		output.PrimaryUserComputingID = userDigits[1 : len(userDigits)-1]
	}
	if strings.Index(name, " ") < 0 || strings.Index(name, ",") < 0 || len(librarianDigits) < 3 {
		output.Staff = "INVALID NAME"
	} else {
		output.Staff = librarianDigits[1:len(librarianDigits)-1] + " " + name[strings.Index(name, " ")+1:] +
			" " + name[0:strings.Index(name, ",")]
	}
	output.PrimaryUserName = reName.FindString(input.RequiredAttendees) + " "
	output.School = "College"
	output.ArlInteractionType = "Other"
	sc := strings.LastIndex(input.StartTime, ":")
	ec := strings.LastIndex(input.EndTime, ":")
	if sc < 0 || ec < 0 {
		output.SessionDuration = "INVALID TIME"
	} else {
		form := "3:04PM"
		startTime, err := time.Parse(form, strings.ReplaceAll(input.StartTime[:sc]+input.StartTime[sc+3:], " ", ""))
		endTime, err := time.Parse(form, strings.ReplaceAll(input.EndTime[:ec]+input.EndTime[ec+3:], " ", ""))
		if err != nil {
			panic(err)
		}
		output.SessionDuration = fmt.Sprint(endTime.Sub(startTime).Hours())
	}
	if strings.Index(input.Description, "{") > -1 && strings.Index(input.Description, "}") > -1 {
		info := input.Description[strings.Index(input.Description, "{"):strings.Index(input.Description, "}")]
		types := strings.Split(info, ",")
		if len(types) != 4 {
			output.School = "NONE SPECIFIED"
			output.RdeSneGroup = "NONE SPECIFIED"
			output.PrePostTime = "0"
			output.Topic = "NONE SPECIFIED"
		} else {
			school := schoolAbbreviations(types[0][1:])
			output.School = strings.ReplaceAll(strings.ReplaceAll(school, ",", ""), " ", "")
			output.RdeSneGroup = strings.ReplaceAll(strings.ReplaceAll(types[1], ",", ""), " ", "")
			output.Topic = strings.ReplaceAll(strings.ReplaceAll(types[2], ",", ""), " ", "")
			output.PrePostTime = strings.ReplaceAll(strings.ReplaceAll(types[3], ",", ""), " ", "")
		}
	} else {
		output.School = "NONE SPECIFIED"
		output.RdeSneGroup = "NONE SPECIFIED"
		output.PrePostTime = "0"
		output.Topic = "NONE SPECIFIED"
	}
	output.ArlInteractionType = "Reference transaction"
	output.AdditionalNotes = "Location: " + input.Location
	output.Description = input.Subject
	return output
}

func schoolAbbreviations(school string) string {
	switch strings.ToLower(school) {
	case "ash", "humanities", "arts and sciences: humanities":
		return "arts and sciences: humanities"
	case "business", "darden":
		return "business"
	}
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
