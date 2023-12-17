# Secret Santa API

## Description

This is a RESTful API for a "Secret Santa" application, built with Node.js. It provides functionalities for user registration, group management, and secret assignment of "Secret Santas" to each group member.

## Features

Postman collection avaliable in a JSON format in "./src/docs/postmanCollection"


### User Registration and Authentication
- User account creation with authentication.
- Managing password security.
- Implementing JWT authentication.

### Creation and Management of Groups
- Allowing users to create groups.
- Inviting members via email.
- Accepting or declining invitations.

### Secret Assignment of "Secret Santas"
- Algorithm to randomly assign a group member to each participant.
- Ensuring no one ends up with their own name.

## Requirement
- MongoDBCompass
- Postman


## Installation

To get started with this project, follow these steps:

1. Clone the repository: git clone git@github.com:EstherMhV/Api_exam.git

2. Install the dependencies
  
  - mpm i express
  - npm i mongoose
  - npm i nodemon
  - npm i swagger-ui-express
  - npm i jsonwebtoken
  - npm i bcrypt
  - npm i swagger-jsdoc

## Maintainers

- Esther Mehal
