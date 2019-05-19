#!/usr/bin/env bash

sequelize model:create --name User --attributes "username:string, password:string, contact:string, isAdmin:boolean"

sequelize model:create --name Sms --attributes "message:string, sentOn:date, receivedOn:date, status:string"
