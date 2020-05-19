# Quote Center E-Commerce

## Table of Contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Front End](#front-end)
* [Back End](#back-end)
* [Database](#database)

## General Info

## Technologies
* Front End:
  * ReactJS
  * Firebase Auth
  * NodeJS
  * NPM Modules

## Front End

### Quick Start
Clone Repo from [https://github.com/alberto-clara/qc-capstone](https://github.com/alberto-clara/qc-capstone)

![image1](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image001.png?raw=true)

You will need to install the following:
* NodeJS - Install through terminal or [https://nodejs.org/en/](https://nodejs.org/en/).
* NPM - Install through terminal or [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm)
  * Note: NodeJS usually includes NPM
* ReactJS - [Documentation](https://reactjs.org/docs/getting-started.html). 
  
* NPM Modules - Run on terminal: ```npm i```

Once everything is installed, you may go ahead and run the project locally in your computer.

There are many ways to run the project:

Go inside the following folder ```front-end/react-docker-app```
* Option 1: ```npm start``` will run the react-app
* Option 2: ```npm run reset``` will "compile" custom tailwindcsss changes and then run the react-app

### Learning about React
* Step-by-Step on how to create a ReactJS project from scratch: [create-react-app](https://www.taniarascia.com/getting-started-with-react/)

### Learning about Tailwind CSS
Tailwind CSS is a CSS utility. It is similar Bootstrap, Semantic UI, etc. but gives more flexibility. It gives the freedom to create your own CSS commands and variables.

You can create inline tailwind csss as normal css.

Ex: ```className="px-0"```

You can create your own custom Tailwind CSS, this will require to run ```npm run reset``` everytime you add anything to the file ```front-end/react-docker/app/src/csss/MainStyle.css```.

Ex:
```
{ 
  Height: 20px; // CSS code 
  @apply px-2 bg-orage-400 //Tailwind code 
} 
```

The command ```npm run reset``` will compile anything inside MainStyle.css, the script of this command is found under ```front-end/react-docker/src/scriptnode```

If you want to modify any tailwind configuration, go to ```front-end/react-docker/tailwind.config.js```

### Firebase Auth
Firebase manages the authentication in our front-end and back-end. It provides a temporary unique token that is used when calling some routes. The tokens are unique and change every hour or less.

![image2](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image002.png?raw=true)

#### Information:
* Firebase Official Documentation: [https://firebase.google.com/docs](https://firebase.google.com/docs)
* Link: [https://console.firebase.google.com](https://console.firebase.google.com)
* Username: ```test420.firebase@gmail.com
* Password: Firebase420!

#### Important Firebase Files in Front End:
FireBaseSetup.js 
* To change any configuration for firebase on the front-end, you can modify “/front-end/react-dock-app/src/FireBaseSetup.js” 

AuthContext.js  
* This work as Redux Reducer to keep the contain of auth information used in all the pages that require authentication.

#### Firebase Console

Open Project: HomeDepotCS420

### Front End Quirks

Location: “front-end/react-docker-app/src/ListOfLinks.js” 
API Routes used in across the front-end. (Feel free to rename them)


## Back End

### Quick Start
There is no specific order that the microservices of the backend need to be started in. To start each of them from a terminal such as PowerShell or bash simply go to the directory of that service and do the following: 

* Step 1: ```dotnet build```
* Step 2: ```dotnet run```
![image3](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image003.png?raw=true)

### Tools

#### ASP.NET CORE v2.2.109
The framework that was used for the backend development was ASP.NET CORE version 2.2.109. This was selected because it was the more current version of the framework that was compatible with the version of Visual Studio that those of us on the original backend development team had access to.

It can be downloaded from: [https://dotnet.microsoft.com/download/dotnet-core/2.2](https://dotnet.microsoft.com/download/dotnet-core/2.2)

* Note: The SDK is what is required the runtime download is not needed. 

#### CouchBase (Catalog API Tool)
This is an NuGet package that simplifies connecting to the Couchbase buckets. This package is used in the CatalogAPI, BasketAPI and CheckoutAPI. The package allows for the use of dependency injection which is not available in the standard Couchbase packages.

[https://blog.couchbase.com/dependency-injection-aspnet-couchbase/](https://blog.couchbase.com/dependency-injection-aspnet-couchbase/)

[https://github.com/couchbaselabs/Couchbase.Extensions/blob/master/docs/dependency-injection.md](https://github.com/couchbaselabs/Couchbase.Extensions/blob/master/docs/dependency-injection.md)

#### Ocelot v15.0.6 (API Gateway Tool)
[https://github.com/ThreeMammals/Ocelot](https://github.com/ThreeMammals/Ocelot)

[https://ocelot.readthedocs.io/en/latest/introduction/gettingstarted.html](https://ocelot.readthedocs.io/en/latest/introduction/gettingstarted.html)

[https://docs.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/implement-api-gateways-with-ocelot](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/implement-api-gateways-with-ocelot)

Ocelot is an API Gateway middleware that only works with ASP.NET Core applications and is designed to be used with microservices. Ocelot allowed us to have an API gateway ready to go with very little configuration and few lines of code instead of having to write our own custom API gateway from scratch. In our project it essentially acts as a middleman or router. The API Gateway will receive the HTTP request from the frontend and forwards them to the correct microservice based on the destination address in the request and routes from a JSON file. The JSON file with the routes can be found at /qc-capstone/back-end/Api/ApiGateway/Ocelot.json

The way it works is when it receives an HTTP request from the frontend it will decide which microservice to forward the request based on the UpStreamPathTemplate to the correct DownStreamPathTemplate.

![image4](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image004.png?raw=true)

#### MailKit v2.6.0
[http://www.mimekit.net/docs/html/Introduction.htm#!](http://www.mimekit.net/docs/html/Introduction.htm#!)

MailKit is used to send an email to a customer when they have completed their purchase. It allows for a simple way to build and send email and text messages from .NET Core applications. 

### Quirks
Because discount information was added later entirely new controllers were created that worked with the discount information. This was done to keep the application working because the frontend still relied upon the original controllers.  

There is a new controller for the BasketApi that works with discount information but the frontend didn’t have time to incorporate it into the project. Beyond just working with discount information the BasketDiscController also addressed a poor data validation vulnerability. 

The BasketApi and CheckoutApi were designed before it was realized Firebase could not store user information in the way we had originally planned for so the basket and checkout documents are looked up by the user_id from the decrypted Firebase token instead having their own unique primary keys which is a much better way of doing things. 

There was not enough time to restructure the project to use a message broker such as RabbitMQ or Kafka so instead plain HTTP requests were used for interprocess communication when needed.


### Back End Testing
There are two different ways that all of the routes on the different microservices can be tested. The first is with Swagger which is a middleware that is added during startup for all the microservices except theApi Gateway. The second is Postman which is a free application that can be downloaded. There are collections for each of the microservices that contain the routes. Since both the BasketApi and CheckoutApi require authorization which is done through Firebase JWT tokens when testing these services a token will need to be retrieved from the frontend. The easiest way to accomplish this is as follows:

1. Log into the website
2. Open the developer tools (CTRL + Shift + i in Chrome) and select the user icon from the far right of the nav bar 
![image5](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image005.png?raw=true)
3. From the Network tab in developer tools select the request named “find”
![image6](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image006.png?raw=true)
4. Now select the Authorization field in the Headers tab of this request and highlight everything except “Bearer “.
![image7](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image007.png?raw=true)
5. Copy the token and it can be pasted into Swagger or Postman to use for testing the BasketApi or CheckoutApi.
* Note: The token for a user is not permanent. It will expire after a period of time that seems to be around two hours.


#### Swagger
API Documentation about Routes
Swagger can be accessed directly through the browser. The URL for each of the microservices is as follows: 
* CatalogApi: http://localhost:7001/swagger/ 
* BasketApi: http://localhost:7003/swagger/ 
* CheckoutApi: http://localhost:7004/swagger 

From here you can select any of the routes you wish to test.

![image8](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image008.png?raw=true)

Click “Try It Out” and you can now enter in the required information. This works for both information that is needed in the request URL or information that will be included in the request body.

![image9](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image009.png?raw=true)

Once the information you want to include is added select “Execute” and you will see the response code and content.

![image10](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image010.png?raw=true)

### Postman
Link: https://www.postman.com/ 

Postman is what I recommend using to test and document the various routes in the different APIs. After downloading and installing Postman import the three collections that contain the different requests for each of the APIs. The collections can be found at /back-end/PostmanCollections. The CatalogApi requires no authorization when requests are being sent so as long as the MySQL database, API gateway, CatalogApi and Couchbase database are running if testing any routes in the CatalogDiscController requests can be sent without any changes. For the BasketApi and CheckoutApi however there is a step that must be completed first and done each time the Firebase JWT token expires. 
* Step 1: As shown above retrieve a valid token from the frontend
* Step 2: Add the token to the collection 
* Step 3: Right click on the collection and select “edit” 

![image11](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image011.png?raw=true)

Now select the Authorization tab and paste the new token into the token field.

![image12](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image012.png?raw=true)

### Database Information

For this project there are both SQL and NoSQL databases being used. For the SQL database we are using MySQL and for the NoSQL databases we are using Couchbase.

### MySQL

The MySQL database consists of three tables, products, offerings and suppliers. Both the products and suppliers table have a 1 to many relationship with the foreign keys in the offerings table.

```
User: root
Password: password
```

### Schema

![image13](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image013.png?raw=true)

### Couchbase

Couchbase was used for the NoSQL databases. We used a single cluster that consisted of four databases. The databases store JSON documents. Further information about each of these databases is provided in sections below.

1.	Basket: Used to store the offerings and associated information that a user has selected to add to their basket/shopping cart.
2.	Checkout: Stores a users completed orders.
3.	UserInfo: Stores the information about a user that is used when purchasing their order such as their shipping information.
4.	Discounts: Stores the discount information that was provided at the beginning of the project.

To view the Couchbase database go to https://localhost:8091
```
Username: admin
Password: password
```
### Basket

The schema for the Basket JSON documents was designed so that each used would only have a single document. This greatly simplified the processes of searching for the correct document. This is done by the document consisting of an array of objects where each object is an offering that the user has added to their basket. The datatypes shown below are from the C# model.

![image14](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image014.png?raw=true)

### Checkout

The Checkout documents are designed in a similar way to the Basket documents except instead of there being an array of objects for the offerings there is an array of objects where each one is a completed order. Then within the orders object there is basic information about the order such as the data, total cost, etc. and another array of objects that holds each of the offerings that the user purchased in that order. The shipping information is also stored in this document. The reasoning behind this is that for an order you would want to save the shipping information the user provided for that order and include it with each one incase the information changed in the future although there is probably a much more efficient way to accomplish this.

![image15](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image015.png?raw=true)

### UserInfo

The UserInfo document contains all the information that the user can enter and is used for their shipping information when purchasing their order. The schema of the document was modeled off of the information that the frontend was collecting from the user.

![image16](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image016.png?raw=true)

There is the main UserInfo JSON object that contains two strings Uid which is the user_id and their email. Name is another JSON object that contains first, middle and last name. There are two Address objects for a primary and secondary shipping address. Finally, there are two Phone_num objects for a primary and secondary phone number.

## Database

### MySQL

Source: https://www.mysql.com/
Download and install MySQL and MySQL Workbench if you want a GUI instead of using command line. The database dump is located at /back-end/Database/Dump20191111.sql and can be imported to have all the tables and information.

### Couchbase 

The easiest and fastest way to run and use the Couchbase databases is through the Docker container script that was made.

Step 1: Build the Docker container.
From the CB-Frontend directory enter the follow command: ```docker build –t cb .```

![image17](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image017.png?raw=true)

Step 2: Run the Couchbase Docker container.
```docker run -d --name cb-server -p 8091-8094:8091-8094 -p 11210:11210 cb```

![image18](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image018.png?raw=true)

Step 3: Verify everything worked correctly.
To access the logs when the container was run use the following command: docker logs -f cb-server
What we are trying to verify with the logs is that everything in the configure.sh script which is run when the container starts up completed correctly.

![image19](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image019.png?raw=true)

![image20](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image020.png?raw=true)

If everything in the script completed correctly when going to the URL for the Couchbase databases the different views should look like this however the Basket, Checkout and UserInfo buckets will be empty.
If everything worked correctly there will be four buckets and the Discounts bucket should have 163 documents.

![image21](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image021.png?raw=true)

There will also be seven indexes.

![image22](https://github.com/alberto-clara/qc-capstone/blob/master/Documents/images/image022.png?raw=true)

### Configure.sh

Location: /back-end/Database/CB-Frontend/configure.sh
Configure.sh is the shell script that executed when the Docker container start and is used to preconfigure the Couchbase databases. I will briefly explain what the script is doing incase changes or additions need to be made in the future.
```
check_db() {
    curl --silent http://127.0.0.1:8091/pools > /dev/null
    echo $?
}
 
until [[ $(check_db) = 0 ]]; do
    sleep 1
done
```
To start off we need to wait until the base Couchbase database comes online we the script waits until it is ready, this usually only takes a few seconds.
```
curl -v -X POST http://127.0.0.1:8091/pools/default \
    -d memoryQuota=4048 \
    -d indexMemoryQuota=512
```
Setup the cluster memory and index memory quota. The value of memoryQuota is the overall amount of memory and memory quota for each of the buckets will be subtracted from this. For example it isn’t possible to have a cluster memory quota of 4048 and then have 5 buckets with 1000 because the cluster will not have enough memory left for the final bucket.
```
curl -v -X POST http://127.0.0.1:8091/node/controller/setupServices \
    -d services=kv%2Cn1ql%2Cindex%2Cfts
```
Set up the services that we want available on the cluster such as N1QL and indexing.
```
curl -v -X POST http://127.0.0.1:8091/settings/web \
    -d port=SAME \
    -d username=admin \
    -d password=password
```
Set the username and password needed to log into the cluster.
```
curl -i -u admin:password -X POST http://127.0.0.1:8091/settings/indexes \
    -d storageMode=memory_optimized
```
The storage mode for the index needs to be “memory optimized” for the later indices being created to work.

The next four curl requests are to create an individual bucket. For example this is to create the Basket bucket.
```
curl -v -u admin:password -X POST http://127.0.0.1:8091/pools/default/buckets \
    -d name=Basket \
    -d bucketType=couchbase \
    -d ramQuotaMB=512 \
    -d authType=sasl \
    -d saslPassword=password
```
Next the script waits for 15 seconds to give the Couchbase cluster enough time to finish setting up all of our requests.
```
curl -v -X PUT \
    -u admin:password \
    -H 'Content-Type: application/json' \
    http://127.0.0.1:8092/Basket/_design/dev_BasketDisc \
    -d @/opt/couchbase/by_id.ddoc
```
This request is used to create the view that is used for the sub document query in the BasketDiscController. The view comes from the file by_id.ddoc.
```
cbimport json -c couchbase://127.0.0.1 -u admin -p password \
    -b Discounts --d file:///opt/couchbase/discounts.json -f lines -g key%id%
```
Used to import all of the Discount documents to the Discounts buckets.

Finally seven cbq commands are sent to the cluster to create each of the indexes that are used.

### Production

The previous information outlines how to run the project in a localhost development environment. To run our front-end, back-end microservices, and databases, Docker was used to containerize each aspect of this project, which could be uploaded to an Azure container registry. From there, all containers are run using Azure services.

### Azure

Before deploying to Azure, you’ll need to create an account and set up a few resources. First you’ll need to create an azure container registry.
In the Azure portal, select Create a Resource and search for “Container Registry”. Create a new resource group called “qcapp” and set the name of the registry to “qcshop”. Set the location as “West US 2” and choose an SKU. We used the Standard SKU but the basic SKU should work just as well. Create the Container Registry

### Back End Deploy

Each microservice uses Development and Production files to allow continuous localhost development and production build deployment. These microservices are run in groups on Azure in Container Instances. 
Each Container Group will be given a URL in the form of “[Name].westus2.azurecontainer.io”
The following Container groups are:

```
------------------|---------------------------------------------|--------------------------------------|
Container name    |          Containers Included                |                  URL                 |
------------------|---------------------------------------------|--------------------------------------|
qcMicro1          |	ApiGateway, CatalogApi, nginx-with-ssl	|qc-micro1.westus2.azurecontainer.io   |
------------------|---------------------------------------------|--------------------------------------|
qcMicro2          |	BasketApi, CheckoutApi	                |qc-micro2.westus2.azurecontainer.io   |
------------------|---------------------------------------------|--------------------------------------|
qcDatabase        |	catalogdb, couchbase	                |qc-database.westus2.azurecontainer.io |
------------------|---------------------------------------------|--------------------------------------|
```

## Container Group 1 - qcMicro1

### ApiGateway

In development, all http requests are handled on localhost via Ocelot. For production, any calls within the same container group use localhost while others will call the url and port of the container group it belongs to. ocelot.Production.json in the ApiGatway directory already contains the appropriate URLs for Production. No changes necessary on initial deployment.

### CatalogApi

CatalogApi connects directly to the Catalog Database. These calls are handled in the “appsettings.[environment].json” files. Again, the production files will be configured to work with the other container groups. No changes necessary on initial deployment.

### nginx-with-ssl

This container serves as an https redirection from the front end to the ApiGateway. The configuration file is found in “back-end/Api/nginx.conf”. This file is used in conjunction with ssl certificates and keys in configuring the container with ssl support. The following guide will provide steps for generating self-signed certificates.
https://medium.com/@samkreter/adding-ssl-tls-to-azure-container-instances-1e608a8f321c
As shown in the guide, place the final values in the secret section of deploy-micro1.yaml.

### Deploying

Before we can create the azure container instance, we need to use the container registry login credentials. Navigate to your qcshop container registry resource in Azure. Under Settings -> Access Keys, make sure the Admin User is enabled.
Modify line 58 of “back-end/Api/ deploy-micro1.yaml” to use the password of your container registry which is found in the Access Keys section in Azure.
In your terminal, you’ll need to log in to your container registry before you can push images to it. In your terminal:
```
> docker login qcshop.azurecr.io
> username: qcshop
> password: [use password/password2 found in Access Keys]
```
The commands required to build the required docker images, push them to the registry, and build the container instance can all be found in “back-end/Api/buildMicro1”. In a Linux environment, this can be run as a bash script. Run this script or each line individually to deploy the container instance. Ignore any error about deleting the container on first deploying. This script will run Dockerfiles for each microservice.

## Container Group 2 - qcMicro2

### BasketApi

BasketApi will connect to the database container group to connect to the couchbase database. This is handled in the appsettings.[environment].json files in the BasketApi directory. No changes necessary on initial deployment.

### CheckoutApi

CheckoutApi will connect to the couchbase database just like the BasketApi. In addition, it also redirects back to the ApiGateway as it needs some info from the CatalogApi. All of these transactions are handled in the appsettings.[environment].json files in the CheckoutApi directory. No changes necessary on initial deployment.

### Deploying

As we did with Container Group 1, we’ll need to set the yaml file. Modify line 37 of ```back-end/Api/ deploy-micro2.yaml``` to use the password found in your container registries Access Keys page.
As was done with container group 1, there is a script file which contains the commands for creating and deploying container group 2. run “back-end/Api/buildMicro1” to create and deploy qcMicro2.

## Container Group 3 - qcDatabase

This group is a bit different than the previous groups. For these we will take a mor manual approach to each Docker image.

### Catalogdb

Open a terminal in “back-end/Database/CatalogDB/”. In your terminal run:
```
> docker build –t qcshop.azurecr.io/catalogdb:latest .
> docker push qcshop.azurecr.io
```
This will create a Docker image using a Sql dump. This dockerfile can be reused with a new sqldump if changes have been made.

### Couchbase

Modify line 3 of “back-end/Database/CB-Frontend/Dockerfile” to
COPY configureCloud.sh /opt/couchbase
Open a terminal in “back-end/Database/CB-Frontend”. In your terminal run:
```
> docker build –t qcshop.azurecr.io/couchbase:latest .
> docker push qcshop.azurecr.io
```
Revert the change made to the Dockerfile.

### Deploying

Modify line 37 of ```back-end/Api/ deploy-database.yaml``` to use the password of your container registry which is found in the Access Keys section in Azure.
The scriptfile “back-end/API/buildDB” can be run after both images have been successfully pushed to the registry.

## Front End Deploy

The front end uses a “.env” file, found in the “front-end/react-docker-app/”. This contains one variable which can be changed by commenting out the undesired setting. You can ignore this for now. We will return to this after configuring the back end. A Dockerfile in the same directory is responsible for building an image to be used with Azure app services.
