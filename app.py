from flask import Flask, jsonify, request, render_template
from flask import jsonify
from flask_cors import CORS
from utils.get_data import *

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/", methods = ["GET","POST"])
def index():
    return render_template("index.html") # Home Page

@app.route("/test", methods = ["GET","POST"])
def test():
    return render_template("template.html")

@app.route("/tp", methods = ["GET","POST"])
def test_slider():
    return render_template("tp.html")

@app.route("/get-data",methods = ["GET","POST"])
def get_data():
    plot_type = request.json["plot_type"]
    
    if plot_type=="barplot":
        variable_name = request.json["variable_name"]
        min_year = request.json.get("min_year",2000)
        max_year = request.json.get("max_year",2019)
        result = get_barplot_data(variable_name,min_year,max_year)
        return jsonify(result)
        
    elif plot_type=="multilineplot":
        variable1 = request.json["variable1"]
        variable2 = request.json["variable2"]
        country = request.json["country"]
        
        result = get_multilineplot_data(variable1,variable2,country)
        
        return jsonify(result)
    
    elif plot_type=="scatterplot":
        variable1 = request.json["variable1"]
        variable2 = request.json["variable2"]
        variable3 = request.json["variable3"]
        
        year = request.json["year"]

        result = get_scatterplot_data(variable1, variable2, variable3, year)

        return jsonify(result)
        
    elif plot_type=="geomap":
        year = request.json["year"]
        result = get_geomap_data(year)

        return jsonify(result)

    elif plot_type == "pcpPlot":
        year = request.json["year"]
        country = request.json["world"]

        result = get_pcp_data(year,country) 
        return jsonify(result)
    
    elif plot_type == "barplot2":
        year = request.json["year"]
        country = request.json["country"]

        result = get_barplot2_data(year, country)
        return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)