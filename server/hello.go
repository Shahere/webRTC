package main

import (
	"encoding/json"
	"log"
	"net/http"

	socketio "github.com/zishang520/socket.io/servers/socket/v3"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "world",
	})
}

func main() {
	http.HandleFunc("/hello", helloHandler)

	http.ListenAndServe(":3000", nil)

	io := socketio.NewServer(nil, nil)
	io.On("connection", func(clients ...any) {
		socket := clients[0].(*socketio.Socket)

		log.Println("client connecté :", socket.Id())

		socket.On("ping", func(msg ...any) {
			log.Println("ping reçu :", msg)
			socket.Emit("pong", "hello depuis Go ")
		})

		socket.On("disconnect", func(reason ...any) {
			log.Println("client déconnecté :", reason)
		})
	})

	log.Println("GO run")

}
