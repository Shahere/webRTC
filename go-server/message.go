package main

import (
	"encoding/json"
	"fmt"
)

type Message struct {
	Target string `json:"target"`
}

func DecodeMessage(data []byte) *Message {
	var message Message
	err := json.Unmarshal(data, &message)
	if err != nil {
		fmt.Printf("Error while decoding message\n")
		fmt.Println(err)
	}
	return &message
}
