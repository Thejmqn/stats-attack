package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/testBackend/{input}", inputHandler).Methods(http.MethodGet)
	router.HandleFunc("/upload", uploadHandler).Methods(http.MethodPost)
	router.Use(mux.CORSMethodMiddleware(router))
	log.Fatal(http.ListenAndServe(":8080", router))
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		return
	}
	file, _, err := r.FormFile("data")
	fileName := uuid.New().String() + ".csv"
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
	fmt.Println("Saved file as " + fileName)

	readFile, err := os.OpenFile(fileName, os.O_RDWR, os.ModePerm)
	if err != nil {
		log.Fatal(err)
	}
	csvReader := csv.NewReader(readFile)
	_, err = csvReader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	w.Header().Set("Content-Type", "text/csv")
	w.Header().Add("Content-Disposition", `attachment; filename="data.csv"`)
	b, err := ioutil.ReadFile(fileName)
	if err != nil {
		panic(err)
	}
	_, err = w.Write(b)
	if err != nil {
		log.Fatal(err)
	}

	file.Close()
	csvFile.Close()
	readFile.Close()
	err = os.Remove(fileName)
	if err != nil {
		log.Fatal(err)
	}
}

func handleCSV(data [][]string) [][]string {
	newData := data
	newData[2][3] = "WHEY"
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
