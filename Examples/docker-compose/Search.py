import csv
import os
import sys
import re
import time
import datetime
import progress

import whoosh
from whoosh.index import create_in
from whoosh.index import open_dir
from whoosh.index import exists_in
from whoosh.fields import *
from whoosh.qparser import QueryParser
from whoosh.qparser import MultifieldParser
from whoosh import qparser

import database as db

class FhooshRoh(object):
    def __init__(self):
        super(FhooshRoh, self).__init__()
        self.folder = 'fishyIndex'
        self.index()
    
    def search(self, q):
        start = time.time()
        id_list = []
        with self.indexer.searcher() as search:
            query = MultifieldParser(['Title', 'Description'], schema=self.indexer.schema)
            query = query.parse(q)
            results = search.search(query,limit=None)
            # print(results)
            for x in results:
                print('search returning {}'.format(x))
                id_list.append(x['id'])
        id_list = id_list[:db.MAX_LIST_LENGTH]
        end = time.time() - start
        return (len(id_list), end, id_list)

    def createIndex(self):
        schema = Schema(
                id=ID(stored=True), 
                Title=TEXT(stored=True),
                Kingdom=TEXT(stored=True),
                Phylum=TEXT(stored=True),
                Class=TEXT(stored=True),
                Order=TEXT(stored=True),
                Family=TEXT(stored=True),
                Genus=TEXT(stored=True),
                Description=TEXT(stored=True)
            )
        self.indexer = create_in(self.folder,schema)
        self.updateAll()
        # db.tokenize()

    def index(self):
        if(exists_in(self.folder)):
            self.indexer = open_dir(self.folder)
        else:
            self.createIndex()
            

    def updateAll(self):
        writer = self.indexer.writer()
        rows = db.getUpdate()
        count = len(rows)
        if(count == 0):
            print("No rows need indexing")
            writer.commit()
            return
        count -= 1
        progress.show(0,count,prefix='Progress:',suffix='Complete',length=50)
        for i,row in enumerate(rows):
            self.indexRow(writer,row)
            progress.show(i,count,prefix='Progress:',suffix='Complete',length=50)
        writer.commit()
        # db.tokenize()
        print("\nDone Indexing : " + str(count) + " rows")
    
    def addAll(self):
        writer = self.indexer.writer()
        rows = db.getAllIDs()
        count = len(rows)
        if(count == 0):
            print("No rows need indexing")
            writer.commit()
            return
        count -= 1
        progress.show(0,count,prefix='Progress:',suffix='Complete',length=50)
        for i,row in enumerate(rows):
            self.indexRow(writer,row)
            progress.show(i,count,prefix='Progress:',suffix='Complete',length=50)
        writer.commit()
        # db.tokenize()
        print("\nDone Indexing : " + str(count) + " rows")

    def indexRow(self, writer, row):
        # add a row from the database into the index
        # and updates the index date
        # DOES NOT COMMIT THE CHANGE
        writer.add_document(
            id=str(row['id']),
            Title=row['title'],
            Kingdom=row['kingdom'],
            Phylum=row['phylum'],
            Class=row['class'],
            Order=row['_order'],
            Family=row['family'],
            Genus=row['genus'],
            Description=row['description']
        )
        db.update(row['id'], {'index_date':datetime.datetime.now()})
