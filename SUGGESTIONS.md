- Change the localhost link removing http**s**

https://localhost:3000 to http://localhost:3000

Because in localhost, you don`t have ssl. 

- Prisma running in MacBook with ARM architecture needs a specific configuration to work the docker-compose up -d
  
generator client {
  provider        = "prisma-client-js"
  binaryTargets   = ["native", "darwin-arm64"] // you need to include this line in the schema.prisma file
}

- Postman collection to API

I made a collection in postman to make easy import the requests in postman

FILE: ./Ablefy.postman_collection.json

You can just use the import functionality and open this file. 