webrtc.savinienbarbotaud.fr

- publish mitmi package
- verify if, react-client/package.json is "mitmi": "1.1.0" (or something else)

- In react-client, change in package.json "file://..." to "mitmi: 1....."
- Delete node-modules and package-lock.json and do "npm i"
- npm run build

- command in react-client/ : docker build -t webrtc-website .
- command : docker compouse up -d 
