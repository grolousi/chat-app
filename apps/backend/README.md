# How to run the backend

`yarn start backend`

# Database

## MongoDB

### Docker commands

#### run mongo image

`docker run -d --name <mongo-container-name> -p 27017:27017 mongo`
`docker run -d --name mongo-chat -p 27017:27017 mongo`

#### Start mongodb shell

`docker exec -it <mongo-container-name> bash`
