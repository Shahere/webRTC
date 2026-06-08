package main

import (
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Client struct {
	id     string
	hub    *Hub
	conn   *websocket.Conn
	toSend chan []byte
}

func (client *Client) write(conn *websocket.Conn) {
	defer func() {
		client.hub.unregister <- client
		client.conn.Close()
	}()

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
}

func (client *Client) read(conn *websocket.Conn) {
	defer func() {
		client.hub.unregister <- client
		client.conn.Close()
	}()
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Printf("Error while reading message\n")
			break
		}
		fmt.Printf("Message Receive : %s\n", message)

		newMessage := DecodeMessage(message)

		if newMessage.From == "" {
			continue
		}
		if newMessage.Target == "" {
			client.hub.broadcast <- message
			continue
		}
		clients := client.hub.getClients()
		var clientToSend *Client
		for _, element := range clients {
			if element.id == newMessage.Target {
				clientToSend = element
			}
		}
		clientToSend.toSend <- message

		fmt.Println(*newMessage)
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
		id:     uuid.Must(uuid.NewRandom()).String(),
		hub:    hub,
		conn:   conn,
		toSend: make(chan []byte),
	}
	client.hub.register <- client

	go client.read(conn)
	go client.write(conn)
}
