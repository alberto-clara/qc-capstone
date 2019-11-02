import os
import sys
import datetime
import re
import csv
from bs4 import BeautifulSoup
from lxml import etree, objectify
import requests
import Search as fsh
import database as db
import progress
import traceback

def setAction(whatAction):
    return 'action='+whatAction+'&'

def setFormat(whatFormat):
    return 'format='+whatFormat+'&'

def searchFor(searchTerms, limit):
    return 'search='+searchTerms+'&limit='+limit+'&'

def titles(whatTitles):
    listOfTitles = '|'.join(whatTitles)
    return 'titles='+listOfTitles+'&'

def page(whatPage):
    return 'page='+whatPage+'&'

def getPage(url):
    page = requests.get(url)
    return page

def searchWikiURL(wikiURL, searchTerms, limit):
    return wikiURL+setAction('opensearch')+setFormat('xml')+searchFor(searchTerms, limit)

def queryWikiURL(wikiURL, queryTerms):
    return wikiURL+setAction('query')+setFormat('xml')+titles(queryTerms)

def imageWikiURL(wikiURL, page):
    return wikiURL+setAction('query')+'prop=pageimages&'+setFormat('xml')+titles([page])+'pithumbsize=1000&'

def parseWikiURL(wikiURL, queryTerms):
    return wikiURL+setAction('parse')+setFormat('xml')+page(queryTerms)

def pp(e):
    print(etree.tostring(e, pretty_print=True))
    print('')

def getDescription(wiki, entry):
    wikiURL = queryWikiURL(wiki, [entry]) + "prop=extracts&exintro&explaintext&redirects=1"
    root = getHtmlFromParse(wikiURL)
    try:
        html = root.xpath('/api/query/pages/page/extract/text()')[0]
    except:
        return None
    return html

def strip_ns(tree):
    for node in tree.iter():
        try:
            has_namespace = node.tag.startswith('{')
        except AttributeError:
            continue
        if has_namespace:
            node.tag = node.tag.split('}', 1)[1]

#This helper function gets us to the xml stage
def getHtmlFromParse(wikiURL):
    #print(wikiURL)
    #get the raw xml from http
    rawPage = getPage(wikiURL)
    # Process into etree
    root = etree.fromstring(rawPage.content)
    #strip out needless information before returning
    strip_ns(root)
    return root

# use soup to get information out of a wiki table
def getKey(soup,identifier):
    # First look for the cell containing our identifiers
    result = soup.find('td',string=identifier)
    if(result != None):
        btext =  result.find_next_sibling().b
        if(btext == None):
            return result.find_next_sibling().a.get_text()[0:-1]
        return btext.get_text()[0:-1]
    else:
        return "None"

def getImg(wiki, title):
    url = imageWikiURL(wiki, title)
    # print(url)
    root = getHtmlFromParse(url)
    res = root.xpath('/api/query/pages/page/thumbnail/@source')
    if res:
        return res[0]
        # pp(res)
    else:
        return 'None'

def scrape(url):
    purchase = 'aquarium' in url
    wiki = "https://en.wikipedia.org/w/api.php?"

    #Create an empty array for sub links
    arr = []
    #get the list of common fish names, tis resulted in bigger result set
    wikiURL = parseWikiURL(wiki,url) + '&redirects=true&'
    root = getHtmlFromParse(wikiURL)
    
    print("Beginning to scrape: " + wikiURL )
    #or get list of aquarium species. this is the more focused result set.
    
    #we want to search the text so grab it
    html = root.xpath('/api/parse/text/text()')[0]
    soup = BeautifulSoup(html,'html.parser')
    # filter out for wiki links and creat our list
    for link in soup.find_all(href=re.compile("/wiki/")):
        # we slice off the first 6 chars so the links don't start with /wiki/
        arr.append(link.get('href')[6:])
    print('Total links on page:', len(arr))

    #Open our destination csv
    arr = arr
    count = 0
    #db.clearDb()
    length = len(arr) - 1
    progress.show(0,length,prefix='Progress:',suffix='Complete',length=50)
    for i, entry in enumerate(arr):
        progress.show(i,length,prefix='Progress:',suffix='Complete',length=50)
        if len(db.get('wiki_url',entry,1)) >= 1:
            #wiki exists in database
            print('\rSkipping Dulicate: '+entry.ljust(80))
            continue
        #same setup as before
        wikiURL = parseWikiURL(wiki,entry) + '&redirects=true&'
        #print(wikiURL)
        root = getHtmlFromParse(wikiURL)
        try:
            html = root.xpath('/api/parse/text/text()')[0]
        except:
            continue
            
        row = {}

        soup = BeautifulSoup(html,'html.parser')
        row["title"] = root.xpath('/api/parse/@title')[0]
        
        #check after redirect
        if len(db.get('title',row["title"],1)) >= 1:
            #wiki exists in database
            print('\rSkipping Dulicate: '+entry.ljust(80))
            continue

        #print(title)
        #print(soup.find(title="Animal").get_text())
        row["kingdom"] = getKey(soup,"Kingdom:")
        if(row["kingdom"] == "None"):
            continue
            
        count += 1
        row["description"] = getDescription(wiki,entry)
        #print("Description -------------------------")
        #print(description)
        #print("--------------------------------------")
        #print(soup.get_text())
        #name = soup.find_all('h1')
            
        #print('wtf'+kingdom)

        row["phylum"] = getKey(soup,"Phylum:")
        row["class"] = getKey(soup,"Class:")
        row["_order"] = getKey(soup,"Order:")
        row["family"] = getKey(soup,"Family:")
        row["genus"] = getKey(soup,"Genus:")
        row["wiki_url"] = entry
        row["purchaseable"] = purchase
        row["scrape_date"] = datetime.datetime.now()
        row["picture_url"] = getImg(wiki, entry)

        
        try:
            db.insert(row)
        except:
            traceback.print_exc()
            print(entry)
    print("\nScraping Complete, Updating index")
    global dah
    dah.updateAll()
    return count


if __name__ == '__main__':
    db.clearDb()
    global dah
    print("Clearing index")
    dah = fsh.FhooshRoh()
    dah.createIndex()
    dah.updateAll()
    count = 0
    count += scrape('List_of_aquarium_fish_by_scientific_name')
    count += scrape('List_of_common_fish_names')
    count += scrape('List_of_freshwater_aquarium_fish_species')
    count += scrape('List_of_commercially_important_fish_species')
    count += scrape('List_of_brackish_aquarium_fish_species')
    count += scrape('List_of_marine_aquarium_fish_species')
    count += scrape('List_of_endangered_fishes')
    print('total database count:', count)
