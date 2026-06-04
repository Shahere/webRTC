package main

import (
	"fmt"

	"golang.org/x/exp/maps"
)

type Hub struct {
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan []byte
}

func newHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan []byte),
	}
}

func (hub *Hub) getClients() []*Client {
	keys := maps.Keys(hub.clients)
	return keys
}

func (hub *Hub) run() {
	for {
		select {
		case client := <-hub.register:
			hub.clients[client] = true
		case client := <-hub.unregister:
			delete(hub.clients, client)
		case message := <-hub.broadcast:
			fmt.Printf("Broadcast message : %s\n", message)
			for k := range hub.clients {
				k.toSend <- message
			}
		}
	}
}
