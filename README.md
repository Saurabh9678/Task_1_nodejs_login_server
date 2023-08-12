# LOGIN SERVICE

This Node.js backend application, powered by MongoDB, provides user authentication features including user registration, login, and password changing functionalities.

## Environment Variables

To run this project, you will need to add the following environment variables to  config.env file inside database folder

`DB_URI`: MongoDb uri

`PORT`: 3000

`JWT_SECRET` = String

`JWT_EXPIRE` = 5d

`COOKIE_EXPIRE` = number

`SMPT_PASSWORD` = password of your mail

`SMPT_MAIL` = your email

`SMPT_HOST` = your email host

`SMPT_PORT` = PORT number for SMTP


## Installation

Steps to start the project, after cloning add `.env` file then start the server

```bash
    git clone https://github.com/Saurabh9678/Task_1_nodejs_login_server.git
    cd Task_1_nodejs_login_server
    npm install 
    npm start or npm run dev
```



## API Reference

Refer to 
[API Documentation](https://documenter.getpostman.com/view/22900446/2s9Xy5LVaG) for better understanding of the API endpoints and the responses on different scenarios

