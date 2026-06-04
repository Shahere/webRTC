package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Client struct {
	hub *Hub

	conn *websocket.Conn

	toSend chan []byte
}

func (client *Client) write(conn *websocket.Conn) {
	for {
		select {
		case message := <-client.toSend:
			fmt.Printf("Sending message %s\n", message)
			err := conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				fmt.Printf("Error while writing message : %s", message)
				break
			}
		}
	}
	//TODO defer ?
}

func (client *Client) read(conn *websocket.Conn) {
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Printf("Error while reading message\n")
			break
		}
		fmt.Printf("Message Receive : %s\n", message)

		//TODO Send back message to client
		client.toSend <- message
	}
}

func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("Failed to upgrade connection to : %s\n", err.Error())
		return
	}
	fmt.Printf("New client : %s\n", conn.RemoteAddr())
	client := &Client{
		hub:    hub,
		conn:   conn,
		toSend: make(chan []byte),
	}
	client.hub.register <- client

	go client.read(conn)
	go client.write(conn)
}
