package main

type Hub struct {
	clients  map[*Client]bool
	register chan *Client
}

func newHub() *Hub {
	return &Hub{
		clients:  make(map[*Client]bool),
		register: make(chan *Client),
	}
}

func (hub *Hub) run() {
	for {
		select {
		case client := <-hub.register:
			hub.clients[client] = true
		default:
			return
		}
	}
}
