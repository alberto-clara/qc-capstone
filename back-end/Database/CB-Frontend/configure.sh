set -m

/entrypoint.sh couchbase-server &

check_db() {
	curl --silent http://127.0.0.1:8091/pools > /dev/null
	echo $?
}

until [[ $(check_db) = 0 ]]; do
	sleep 1
done

curl -v -X POST http://127.0.0.1:8091/pools/default \
	-d memoryQuota=4048 \
	-d indexMemoryQuota=512

curl -v -X POST http://127.0.0.1:8091/node/controller/setupServices \
	-d services=kv%2Cn1ql%2Cindex%2Cfts

curl -v -X POST http://127.0.0.1:8091/settings/web \
	-d port=SAME \
	-d username=admin \
	-d password=password

curl -i -u admin:password -X POST http://127.0.0.1:8091/settings/indexes \
	-d storageMode=memory_optimized

curl -v -u admin:password -X POST http://127.0.0.1:8091/pools/default/buckets \
	-d name=Basket \
	-d bucketType=couchbase \
	-d ramQuotaMB=512 \
	-d authType=sasl \
	-d saslPassword=password

curl -v -u admin:password -X POST http://127.0.0.1:8091/pools/default/buckets \
	-d name=UserInfo \
	-d bucketType=couchbase \
	-d ramQuotaMB=512 \
	-d authType=sasl \
	-d saslPassword=password

curl -v -u admin:password -X POST http://127.0.0.1:8091/pools/default/buckets \
	-d name=Checkout \
	-d bucketType=couchbase \
	-d ramQuotaMB=512 \
	-d authType=sasl \
	-d saslPassword=password

curl -v -u admin:password -X POST http://127.0.0.1:8091/pools/default/buckets \
	-d name=Discounts \
	-d bucketType=couchbase \
	-d ramQuotaMB=512 \
	-d authType=sasl \
	-d saslPassword=password

sleep 15

curl -v -X PUT \
	-u admin:password \
	-H 'Content-Type: application/json' \
	http://127.0.0.1:8092/Basket/_design/dev_BasketDisc \
	-d @/opt/couchbase/by_id.ddoc


cbimport json -c couchbase://127.0.0.1 -u admin -p password \
	-b Discounts --d file:///opt/couchbase/discounts.json -f lines -g key%id%

cbq -e localhost -u admin -p password --script="CREATE INDEX baskind on Basket(Meta().id)" -q
cbq -e localhost -u admin -p password --script="CREATE INDEX usrind on UserInfo(Meta().id)" -q
cbq -e localhost -u admin -p password --script="CREATE INDEX chkind on Checkout(Meta().id)" -q
cbq -e localhost -u admin -p password \
	--script="CREATE INDEX offkeys on Discounts(distinct array k for k in offering_keys end);" -q
cbq -e localhost -u admin -p password --script="CREATE INDEX pkey on Discounts(product_key)" -q
cbq -e localhost -u admin -p password --script="CREATE INDEX skey on Discounts(supplier_key)" -q
cbq -e localhost -u admin -p password --script="CREATE INDEX discID on Discounts(id)" -q

fg 1
