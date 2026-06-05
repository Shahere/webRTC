package main

import (
	"encoding/json"
	"fmt"
)

type ActionType string

const (
	Close ActionType = "close"
	Other ActionType = "other"
	Test  ActionType = "test"
)

type Message struct {
	Target  string      `json:"target"`
	From    string      `json:"from"`
	Payload PayloadType `json:"payload"`
}

type PayloadType struct {
	Action ActionType `json:"action"`
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
