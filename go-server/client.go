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

func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("Failed to upgrade connection to : %s", err.Error())
		return
	}
	fmt.Printf("New client : %s", conn.RemoteAddr())
	client := &Client{hub: hub, conn: conn}
	client.hub.register <- client
}
