# TODO-APP
    express, mysql, angular, jwt, docker-compose

### VERSION FROM 24.8.2022 now live on Heroku: [todo heroku](https://todo-app-szeke.herokuapp.com)

  
  </br >


### initial setup:
copy sample.env to .env </br >
`cp sample.env .env` </br >

</br >

### first run the docker container for the database:
to run docker: </br >
in `./backend` run `docker-compose up -d` </br >
in subsequent runs just run `docker-compose start` </br >
or `docker-compose stop` to stop the container </br >

</br >

### install and run the backend and the fronted:
from ./frontend run: `npm i` and after: `npm start` </br >
from ./backand  run: `npm i` and after: `npm run dev` </br >
go to `http://localhost:4200` to use the app </br >

</br >


### adminer:
to use adminer go to: http://localhost:8090/ </br >
login: </br >
- server: todoDB
- username: admin
- password: admin
  - after launching the docker container, wait like a minute before logging in

