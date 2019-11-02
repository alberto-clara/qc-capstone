from flask import Flask, abort, session, redirect, render_template, url_for, request
from flask_compress import Compress
from flask_session import Session
import Search as fsh
import database as db
from pagination import Pagination 

app = Flask(__name__)
app.secret_key = "T|N'F+>!%6~S>qTeU*LIG1,GO%|C.&TCP.=Y]twa?uB1?~t*C?#72m5eHaYUrjJ"

SESSION_TYPE = 'filesystem'
COMPRESS_MIMETYPES = ['text/html', 'text/css', 'text/xml', 'application/json', 'application/javascript']
COMPRESS_LEVEL = 6
COMPRESS_MIN_SIZE = 500

app.config.from_object(__name__)
Session(app)
Compress(app)


@app.route('/', methods=['GET', 'POST'])
def index():
    print('home page clearing session')
    session.clear()
    return render_template('index.html')

@app.route('/buy', methods=['GET'])
def buy():
    data = request.args
    fish = data.get('id',None)
    if(fish == None):
        return redirect('/notfound')
    return 'HI GUYS'

@app.route('/notbuyable')
def notbuyable():
    print('notbuyable')
    return render_template('notbuyable.html')

@app.route('/notfound')
def notfound():
    print('notfound')
    search = session['query']
    if search=="":
        search = "fish"

    return render_template('notfound.html',search=search)

@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        data = request.form
    else:
        data = request.args
    
    session.clear()
    session['indexsource'] = data.get('indexsource')
    session['query'] = data.get('searchterm')
    session['perpage'] = data.get('perpage')
    if(session['indexsource'] == 'tsvector'):
        result = db.search(session['query'])
    else:
        global dah
        result = dah.search(session['query'])

    (session['result_count'],session['result_time'],session['result_ids']) = result
    return redirect('/results/')

def get_Result_For_Page(page,per_Page,count):
    results = session.get('result_ids',[])
    return results[(page-1)*per_Page:(page*per_Page)]

def url_For_Other_Page(page):
    args = request.view_args.copy()
    args['page'] = page
    return url_for(request.endpoint, **args)
app.jinja_env.globals['url_for_other_page'] = url_For_Other_Page

@app.route('/results/', defaults={'page': 1})
@app.route('/results/page/<int:page>')
def results(page):
    count = session.get('result_count',0)
    if(count == 0):
        print("no results")
        return redirect('/notfound')

    #per_Page = 10
    per_Page = int(session.get('perpage',10))
    print("we have perpage: " + str(per_Page))
    print("And count: " + str(count))

    results_For_This_Page = get_Result_For_Page(page,per_Page,count)
    if not results_For_This_Page and page != 1:
        print("no results")
        return redirect('/notfound')
    return render_template(
        'results.html', 
        results=db.getPage(results_For_This_Page),
        pagination=Pagination(page,per_Page,count)    
    )

@app.route('/no_results')
def no_results():
    return 'LOL 404'

@app.route('/details/',methods=['GET', 'POST'])
def details():
        if request.method == 'POST':
                data = request.form
        else:
                data = request.args

        id = data.get('id')
        result = db.getIDDict(id)
        print(result)
        return render_template('details.html', data=result )

if __name__ == '__main__':
    print("Start of App")
    global dah
    print("About to load index")
    dah = fsh.FhooshRoh()
    # Peter's quick fix
    # dah.createIndex()
    # dah.addAll()
    app.run(host='0.0.0.0', port=5090)
