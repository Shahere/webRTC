package main

import (
	"golang.org/x/exp/maps"
)

type BroadcastType struct {
	message []byte
	client  *Client
}

type Hub struct {
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan BroadcastType
}

func newHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan BroadcastType),
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
		case broadcastType := <-hub.broadcast:
			//fmt.Printf("Broadcast message : %s\n", broadcastType.message)
			for k := range hub.clients {
				if k == broadcastType.client {
					continue
				}
				k.toSend <- broadcastType.message
			}
		}
	}
}
