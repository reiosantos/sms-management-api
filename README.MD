### SMS Management API

[![Build Status](https://travis-ci.com/reiosantos/sms-management-api.svg?branch=master)](https://travis-ci.com/reiosantos/sms-management-api)
[![Maintainability](https://api.codeclimate.com/v1/badges/b165c6617dafe694577c/maintainability)](https://codeclimate.com/github/reiosantos/sms-management-api/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b165c6617dafe694577c/test_coverage)](https://codeclimate.com/github/reiosantos/sms-management-api/test_coverage)

### Setup

#### Inslall

```bash
git clone https://github.com/reiosantos/sms-management-api.git

cd https://github.com/reiosantos/sms-management-api.git

```

Set the environment variables needed to run the application, A sample **.env.sample** file 
contains all the variables that should be defined.
 
#### Prepare the server

```bash
npm install
npm run db:rollmigrate
```

#### start server

```bash
npm run start:dev
```

Access the api on
```http request
http://localhost:5000/api/v1/
``` 

The API Documentation can be found at **http://localhost:5000/api/v1/docs/** 

![image](https://user-images.githubusercontent.com/23090105/58350830-b387c580-7e6f-11e9-9400-ff10fadc52b3.png)

![image](https://user-images.githubusercontent.com/23090105/58350832-b682b600-7e6f-11e9-8271-520f23d04f67.png)
