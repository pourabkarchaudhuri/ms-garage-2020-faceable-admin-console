# Faceable Governance Dashboard Webapp

This repository contains the source code for the Governance Dashboard Web application for the `Faceable` project as the submission entry for `Microsoft Garage Hackathon 2020` under the category `Hack for Security of Remote Work` to avoid shoulder surfing.

## Screenshots
[![Architecture](https://i.ibb.co/G3S9z04/garage-console-1.jpg)](https://nodesource.com/products/nsolid)

[![Architecture](https://i.ibb.co/93cgM8z/garage-console-3.jpg)](https://nodesource.com/products/nsolid)

[![Architecture](https://i.ibb.co/6F01CKS/garage-console-5.jpg)](https://nodesource.com/products/nsolid)

## Getting Started

### Prerequisites
- [Node.JS](https://nodejs.org/en/) - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.

### `Setting up Environment`
#### 1). Create, run and deploy the Faceable Middleware first (`IMPORTANT`)
Setup the middleware from this repository
`https://github.com/pourabkarchaudhuri/ms-garage-2020-faceable-middleware`

#### 2). Create an Azure App Service
Setup an Azure App Service with `Linux` and `NodeJS` environment.

#### 3). Clone this repository
```
$ git clone https://github.com/pourabkarchaudhuri/ms-garage-2020-faceable-admin-console.git
$ cd ms-garage-2020-faceable-admin-console
````
#### 4). the `.env` file with the relevant keys and URLs from resources created earlier above
`REACT_APP_AUTHORIZATION_TOKEN={put authorization token here}`
The above token can found in the `config.env` of the middleware source code
`REACT_APP_API_URL={put the faceable middleware app service API URL here}/api/v1`
The above will be the URL of the `Azure App Service` created in `Step 2`

#### 5). Running on local:
Under the root directory of the cloned project,
```bash
$ npm install
$ npm start
```
#### 6). Creating production build:
To create a `production` build
```bash
$ npm run build
```
After running this command, a `build` folder gets created in the root directory of the project.
Copy paste the `src\web.config` to the root of the `build` folder

##### Deployement to Azure
* Install the visual studio code extensions for Azure
* Select the extension and Sign in with Azure credentials inside the Visual Studio Code editor
* Select the earlier above provisioned `App Service` Resource
* Select the `build` folder to deploy that

`This is what we have used in the Hackathon. In case if deployment is to be done on a Virtual Machine, then please follow the below steps:`

##### Azure VM (Windows)

- Download and install the latest version of Node.JS from [here](https://nodejs.org/en/) 
- After installing, open command prompt and type ```node --version```
- You will see output like ```v10.15.3```
- Version might be different in your case.
[Node.JS](https://nodejs.org/en/) - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- Once installed, verify it by checking the installed version using the following command
```bash
$ node –version
$ npm –version
```
##### Azure VM (Linux & Ubuntu)
- Open your terminal or press Ctrl + Alt + T and use the following commands to update and upgrade the package manager
```bash
$ sudo apt-get update
$ sudo apt-get upgrade
```
- Install Python software libraries using the following command
```bash
$ sudo apt-get install python-software-properties
```

- Add Node.js PPA to the system
```bash
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash –
```
Note: Here, we are installing node.js version 10, if you want to install version 11, you can replace setup_10.x with setup_11.x.

- To Install Node.js and NPM to your Ubuntu machine, use the command given below
```bash
sudo apt-get install nodejs
```

- Once installed, verify it by checking the installed version using the following command
```bash
$ node –version
$ npm –version
```

