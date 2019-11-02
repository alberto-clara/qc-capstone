import os
import sys
import time
import psycopg2
from psycopg2 import sql

user = os.environ['POSTGRES_USER']
pwd = os.environ['POSTGRES_PASSWORD']
db = os.environ['POSTGRES_DB']
host = 'db'
port = '5432'

MAX_LIST_LENGTH = 7500

TABLE = (
    ("id", "serial", "PRIMARY KEY"),
    ("title", "varchar", "NOT NULL"),
    ("kingdom", "varchar", "NOT NULL"),
    ("phylum", "varchar"),
    ("class", "varchar"),
    ("_order", "varchar"),
    ("family", "varchar"),
    ("genus", "varchar"),
    ("species", "varchar"),
    ("description", "text"),
    ("wiki_url", "varchar"),
    ("picture_url", "varchar"),
    ("purchaseable", "boolean"),
    ("scrape_date", "timestamp"),
    ("index_date", "timestamp")
)
table_columns = [x[0] for x in TABLE]

TVECTOR_TABLE = (
    ("id", "serial", "PRIMARY KEY"),
    ("description", "text"),
    ("tokens", "TSVECTOR")
)
vertor_columns = [x[0] for x in TABLE]

def smart_truncate(content, length=500, suffix='...'):
    if len(content) <= length:
        return content
    else:
        return content[:length].rsplit(' ', 1)[0]+suffix

def getCon():
    try:
        conn = psycopg2.connect(
            "dbname=" + db + 
            " user=" + user +
            " password=" + pwd +
            " host=" + host 
            )
    except psycopg2.OperationalError as e:
        print('Unable to connect!\n{0}'.format(e))
        sys.exit(1)
    else:
        return conn

def createFhooshy():
    with getCon() as conn:
        with conn.cursor() as cur:
            cur.execute(
                'CREATE TABLE fhooshy ({});'.format(
                    ', '.join(map(' '.join, TABLE)))
            )

def createFhooshyVector():
    with getCon() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "CREATE INDEX fhooshy_idx ON fhooshy USING gin(to_tsvector('english', title || ' ' || description));"
            )

def initDb():
    createFhooshy()
    createFhooshyVector()

def clearDb():
    with getCon() as conn:
        with conn.cursor() as cur:
            cur.execute("DROP TABLE if exists fhooshy;")
            cur.execute("DROP TABLE if exists fhooshy_tsvector;")
    initDb()

def insert(data):
    columns = data.keys()
    for col in columns:
        if col not in table_columns:
            raise Exception('{} not in database'.format(col))
    # description = data.get('description')
    with getCon() as conn:
        with conn.cursor() as cur:
            # First we should prolly check our data to make sure it's not bad
            cur.execute(
                "INSERT INTO fhooshy ({}) VALUES ({});".format(
                    ','.join(columns),
                    '%('+')s, %('.join(columns)+')s')
                ,data)
            # if description:
            #     cur.execute(
            #         sql.SQL("INSERT INTO fhooshy_tsvector (description) VALUES (%s)"),
            #         [data.get('title', '') + ' '+ description]
            #     )

def update(id, data):
    columns = data.keys()
    for col in columns:
        if col not in table_columns:
            raise Exception('{} not in database'.format(col))
    with getCon() as conn:
        with conn.cursor() as cur:
            values = ['{0} = %({0})s'.format(col) for col in columns]
            cur.execute(
                sql.SQL("UPDATE fhooshy SET {} WHERE id = '{}';".format(
                    ','.join(values),
                    id)),
                data
            )

# def tokenize():
#     with getCon() as conn:
#         with conn.cursor() as cur:
#             cur.execute(
#                 '''UPDATE fhooshy_tsvector f1
#                 SET tokens = to_tsvector(f1.description)
#                 FROM fhooshy_tsvector f2'''
#             )

def search(query):
    start = time.time()
    query = ' '.join(query.split()) # condense whitespace
    query = query.replace(' OR ', '~|~')
    query = query.replace(' AND ', '~&~')
    query = ' & '.join(query.split())
    query = query.replace('~', ' ')
    print(query)
    with getCon() as conn:
        with conn.cursor() as cur:
            cur.execute(
                sql.SQL("SELECT {} FROM fhooshy WHERE to_tsvector('english', title || ' ' || description) @@ to_tsquery(%s) ORDER BY ts_rank_cd(to_tsvector('english', title || ' ' || description),to_tsquery(%s)) Desc".format('id')),[query,query])
            res = cur.fetchall()
    res = res[:MAX_LIST_LENGTH]
    end = time.time() - start
    return (len(res), end, res)

def getPage(ids):
    results = []
    for _id in ids:
        res = getByID(_id, columns=['title', 'description'])
        # print(res)
        results.append((_id, res[0], smart_truncate(res[1])))
    return results

def getAll():
    with getCon() as conn:
        with conn.cursor() as cur:
            cur.execute(sql.SQL("SELECT {} FROM fhooshy".format(','.join(table_columns))))
            return cur.fetchall()

def getAllIDs():
    with getCon() as conn:
        with conn.cursor() as cur:
            cur.execute(sql.SQL("SELECT {} FROM fhooshy".format('id')))
            return [getIDDict(id[0]) for id in cur.fetchall()]

def getUpdate():
    with getCon() as conn:
        with conn.cursor() as cur:
            cur.execute(sql.SQL("SELECT id FROM fhooshy where index_date < scrape_date OR index_date is null"))
            return [getIDDict(id[0]) for id in cur.fetchall()]

def getByID(_id, columns=None):
    # print(_id, columns)
    if columns is None:
        columns = table_columns
    with getCon() as conn:
        with conn.cursor() as cur:
            cur.execute(sql.SQL("SELECT {} FROM fhooshy WHERE id=%s".format(','.join(columns))),[_id])
            return cur.fetchone()

def getIDDict(_id):
    results = {}
    res = getByID(_id)
    for i, val in enumerate(res):
        name = table_columns[i]
        results[name] = val
    return results

def get(match_column:str, match:str, count:int, operator='=', columns=None):
    if match_column not in table_columns:
        raise Exception('column {} not in database'.format(match_column))
    if columns is None:
        columns = ','.join(table_columns)
    with getCon() as conn:
        with conn.cursor() as cur:
            cur.execute(sql.SQL("SELECT {0} FROM fhooshy WHERE {2} {3}%s LIMIT {1}".format(
                columns,
                count,
                match_column,
                operator)),[match])
            return cur.fetchall()
