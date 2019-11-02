#requirements 
Docker must be working and must include docker compose
on ubuntu based operating systems 

$ sudo snap install docker

should be all you need

# Build the docker image
$ sudo docker-compose build

# Usage
Run the docker
$ sudo docker-compose up

Browse to localhost to see the app in action.

This SHOULD hopefully be all you need to get this to work but.. if it complains about permissions, ensure the dbdata folder is owned by you and readable by root.

if this doesn't work then you will need to rebuild the index, which should take 45-150 minutes depending on your data connection. *on campus expect 3 hours*

# first clear the index
$ sudo rm -rf fishyindex/*
# now scrape, this rebuilds the database and index. Clearing is just to be sure 
$ sudo docker-compose run flaskapp python scraper.py


IF ALL ELSE FAILS, you can get a python env by using
$ sudo docker-compose run flaskapp python

from there you can import and run scraper or the database code. for example to see all rows
$ sudo docker-compose run flaskapp python
>> import database as db
>> db.getAll()

and you should see a bunch of data spitting out
>>db.getId(107) 

should be a Cichlid If scraping worked as it was supposed to.


*** NOTE ****
TESTING indicates that this works best in CHROME
Firefox for some reason doesn't listen to my clear:both on my pushdown and the pagination buttons are unable to be reached. Everything else appears to render properly.

