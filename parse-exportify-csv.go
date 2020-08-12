package main

import (
	//"bufio"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
)

func main() {
	// Open the file
	csvfile, err := os.Open(os.Args[1])
	if err != nil {
		log.Fatalln("Couldn't open the csv file at location ", os.Args[1], err)
	}

	// Parse the file
	r := csv.NewReader(csvfile)
	for {
		// Read each record from csv
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
		back := "\"" + record[4] + " - " + record[2]  + "<br/>"+ "<iframe allow=\"\"encrypted-media\" allowtransparency=\"true\" frameborder=\"0\" height=\"380\" src=\"https://open.spotify.com/embed/track/" + record[0] + "\"\" width=\"\"300\"\"></iframe>" + "\""
		
		front := "\"" + record[2] + "\""
		tags := "\"" + record[10] + "\""

		fmt.Printf("%s,%s,%s\n", front, back, tags)
	}
}