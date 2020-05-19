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
You will need to install the following:
* NodeJS - Install through terminal or [https://nodejs.org/en/](https://nodejs.org/en/).
* NPM - Install through terminal or [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm)
  * Note: NodeJS usually includes NPM
* ReactJS - [Documentation](https://reactjs.org/docs/getting-started.html). 
  * Step-by-Step on how to create a ReactJS project from scratch: [create-react-app](https://www.taniarascia.com/getting-started-with-react/)
* NPM Modules - Run on terminal: ```npm i```

Once everything is installed, you may go ahead and run the project locally in your computer.

There are many ways to run the project:

Go inside the following folder ```front-end/react-docker-app```


### Running the

### Postman
Link: https://www.postman.com/ 

Postman is what I recommend using to test and document the various routes in the different APIs. After downloading and installing Postman import the three collections that contain the different requests for each of the APIs. The collections can be found at /back-end/PostmanCollections. The CatalogApi requires no authorization when requests are being sent so as long as the MySQL database, API gateway, CatalogApi and Couchbase database are running if testing any routes in the CatalogDiscController requests can be sent without any changes. For the BasketApi and CheckoutApi however there is a step that must be completed first and done each time the Firebase JWT token expires. 
* Step 1: As shown above retrieve a valid token from the frontend
* Step 2: Add the token to the collection 
* Step 3: Right click on the collection and select “edit” 

[image1]

Now select the Authorization tab and paste the new token into the token field.

[image2]

### Database Information

For this project there are both SQL and NoSQL databases being used. For the SQL database we are using MySQL and for the NoSQL databases we are using Couchbase.

### MySQL

The MySQL database consists of three tables, products, offerings and suppliers. Both the products and suppliers table have a 1 to many relationship with the foreign keys in the offerings table.

```
User: root
Password: password
```

### Schema

[image3]

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

[image4]

### Checkout

The Checkout documents are designed in a similar way to the Basket documents except instead of there being an array of objects for the offerings there is an array of objects where each one is a completed order. Then within the orders object there is basic information about the order such as the data, total cost, etc. and another array of objects that holds each of the offerings that the user purchased in that order. The shipping information is also stored in this document. The reasoning behind this is that for an order you would want to save the shipping information the user provided for that order and include it with each one incase the information changed in the future although there is probably a much more efficient way to accomplish this.

[image5]

### UserInfo

The UserInfo document contains all the information that the user can enter and is used for their shipping information when purchasing their order. The schema of the document was modeled off of the information that the frontend was collecting from the user.

[image6]

There is the main UserInfo JSON object that contains two strings Uid which is the user_id and their email. Name is another JSON object that contains first, middle and last name. There are two Address objects for a primary and secondary shipping address. Finally, there are two Phone_num objects for a primary and secondary phone number.

## Database Quick Start

### MySQL

Source: https://www.mysql.com/
Download and install MySQL and MySQL Workbench if you want a GUI instead of using command line. The database dump is located at /back-end/Database/Dump20191111.sql and can be imported to have all the tables and information.

### Couchbase 

The easiest and fastest way to run and use the Couchbase databases is through the Docker container script that was made.

Step 1: Build the Docker container.
From the CB-Frontend directory enter the follow command: ```docker build –t cb .```

[image7]

Step 2: Run the Couchbase Docker container.
```docker run -d --name cb-server -p 8091-8094:8091-8094 -p 11210:11210 cb```

[image8]

Step 3: Verify everything worked correctly.
To access the logs when the container was run use the following command: docker logs -f cb-server
What we are trying to verify with the logs is that everything in the configure.sh script which is run when the container starts up completed correctly.

[image9]

[image10]

If everything in the script completed correctly when going to the URL for the Couchbase databases the different views should look like this however the Basket, Checkout and UserInfo buckets will be empty.
If everything worked correctly there will be four buckets and the Discounts bucket should have 163 documents.

[image11]

There will also be seven indexes.

[image12]

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
