FROM couchbase

COPY configure.sh /opt/couchbase

COPY discounts.json /opt/couchbase

COPY by_id.ddoc /opt/couchbase

CMD ["/opt/couchbase/configure.sh"]