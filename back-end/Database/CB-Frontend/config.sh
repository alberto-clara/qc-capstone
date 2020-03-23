!#/bin/bash

/entrypoint.sh couchbase-server &

check_db() {
	curl --silent http://127.0.0.1:8091/pools > /dev/null
	echo $?
}

until [[ $(check_db) = 0 ]]; do
	sleep 1
done

couchbase-cli cluster-init --cluster-name=qc-capstone \
       	--cluster-username=admin \
       	--cluster-password=password \
	--cluster-port=8091 \
	--cluster-ramsize=4096 \
	--cluster-index-ramsize=512 \
	--services="data,index,query,fts"

sleep 5

couchbase-cli bucket-create -c localhost \
        --bucket=Basket \
	--bucket-type=couchbase \
 	--bucket-ramsize=512 \
	-u admin \
	-p password

cbq -e localhost -u admin -p password --script="CREATE INDEX baskInd ON Basket(Meta().id)"

