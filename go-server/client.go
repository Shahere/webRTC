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
}

func (client *Client) writePump(conn *websocket.Conn, messageType int, message []byte) {
	err := conn.WriteMessage(messageType, message)
	if err != nil {
		fmt.Printf("Error white writing message : %s", message)
		return
	}
}

func (client *Client) readPump(conn *websocket.Conn) {
	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Printf("Error while reading message\n")
			break
		}
		fmt.Printf("Message Receive : %s", message)

		//TODO Send back message to client
		client.writePump(conn, messageType, message)
	}
}

func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("Failed to upgrade connection to : %s\n", err.Error())
		return
	}
	fmt.Printf("New client : %s\n", conn.RemoteAddr())
	client := &Client{hub: hub, conn: conn}
	client.hub.register <- client

	go client.readPump(conn)
}
