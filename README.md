<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://www.npmjs.com/package/mitmi">
    <img src="./logo.png" alt="Logo" width="120" height="120">
  </a>

<h3 align="center">Mitmi-website</h3>

  <p align="center">
    Video conferencing website using Mitmi package
  </p>
</div>

[![MIT License][license-shield]][license-url]
![js-shield]
![ts-shield]
![npm-shield]
![react-shield]

<!-- ABOUT THE PROJECT -->
## About The Project

Video conferencing website using Mitmi package. https://webrtc.savinienbarbotaud.fr

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


## Deploy

webrtc.savinienbarbotaud.fr

- publish mitmi package
- verify if, react-client/package.json is "mitmi": "1.1.0" (or something else)

- In react-client, change in package.json "file://..." to "mitmi: 1....."
- Delete node-modules and package-lock.json and do "npm i"
- npm run build

- command in react-client/ : docker build -t webrtc-website .
- command : docker compouse up -d 



[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge

[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt


[js-shield]: https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square
[ts-shield]: https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square
[npm-shield]: https://img.shields.io/npm/v/mitmi
[react-shield]: https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge