package main

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
)

func getRoot(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("%s\n", r.Host)
	fmt.Printf("got / request\n")
	io.WriteString(w, "This is my website!\n")
}
func getHello(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Host)
	fmt.Printf("got /hello request\n")
	io.WriteString(w, "Hello, HTTP!\n")
}

func main() {
	fmt.Printf("Start server...\n")
	http.HandleFunc("/", getRoot)
	http.HandleFunc("/hello", getHello)
	port := 3333

	err := http.ListenAndServe(":"+strconv.Itoa(port), nil)

	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("Server closes")
	} else if err != nil {
		fmt.Printf("Error server starting... %s\n", err.Error())
		os.Exit(1)
	}
}
