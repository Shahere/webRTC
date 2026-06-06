package main

import (
	"encoding/json"
	"fmt"
)

type ActionType string

const (
	Close ActionType = "close"
	Join  ActionType = "join"
	GetId ActionType = "getid"
)

type Message struct {
	Target  string      `json:"target"`
	From    string      `json:"from"`
	Payload PayloadType `json:"payload"`
}

type PayloadType struct {
	Action     ActionType `json:"action"`
	Message    string     `json:"message"`
	Disconnect int        `json:"disconnect"`
	Sdp        string     `json:"sdp"`
	Candidate  string     `json:"candidate"`
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

func (message *Message) encodeMessage() []byte {
	s, err := json.Marshal(message)
	if err != nil {
		fmt.Printf("Error while encoding message")
	}
	return s
}
