This is a container for the couchbase database
The script will create all 4 buckets - Basket, UserInfo, Checkout, Discounts
it will also create the indexes that are needed and import the discount documents

HOW TO BUILD AND RUN

1) docker build -t cb .
2) docker run -d --name cb-server -p 8091-8094:8091-8094 -p 11210:11210 cb

TO SEE LOGS 
docker logs -f cb-server