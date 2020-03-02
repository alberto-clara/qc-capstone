set -m

/entrypoint.sh couchbase-server &

sleep 15

# setup the initial cluster
curl -v -X POST http://127.0.0.1:8091/pools/default \
	-d memoryQuota=4048 \
	-d indexMemoryQuota=512

# setup the services on cluster
curl -v -X POST http://127.0.01:8091/node/controller/setupServices \
	-d services=kv%2Cn1ql%2Cindex%2Cfts

# set the username and password
curl -v -X POST http://127.0.0.1:8091/settings/web \
	-d port=SAME \
	-d username=admin \
	-d password=password

# create a bucket called Basket for the BasketApi
curl -v -u admin:password -X POST http://127.0.0.1:8091/pools/default/buckets \
	-d name=Basket \
	-d bucketType=couchbase \
	-d ramQuotaMB=1024 \
	-d authType=sasl \
	-d saslPassword=password

# create a bucket called UserInfo for the CheckoutApi
curl -v -u admin:password -X POST http://127.0.0.1:8091/pools/default/buckets \
	-d name=UserInfo \
	-d bucketType=couchbase \
	-d ramQuotaMB=1024 \
	-d authType=sasl \
	-d saslPassword=password

# create a bucker called Checkout for the CheckoutApi
curl -v -u admin:password -X POST http://127.0.0.1:8091/pools/default/buckets \
	-d name=Checkout \
	-d bucketType=couchbase \
	-d ramQuotaMB=1024 \
	-d authType=sasl \
	-d saslPassword=password

fg 1