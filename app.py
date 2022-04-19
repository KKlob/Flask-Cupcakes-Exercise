"""Flask app for Cupcakes"""

from flask import Flask, request, render_template, redirect, flash, session, jsonify
from models import db, connect_db, Cupcake

# Configure App
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = 'doifhaofhnaifj'

# connect db to app and create all tables
connect_db(app)

# App.routes below

@app.route('/')
def show_cupcakes_page():
    return render_template('index.html')

@app.route('/api/cupcakes')
def get_all_cupcakes():
    """Return data on all cupcakes in db"""
    cupcakes = [cake.serialize() for cake in Cupcake.query.all()]
    return jsonify(cupcakes=cupcakes)

@app.route('/api/cupcakes/<cc_id>')
def get_cupcake(cc_id):
    cupcake = Cupcake.query.get_or_404(cc_id)
    return jsonify(cupcake=cupcake.serialize())

@app.route('/api/cupcakes', methods=['POST'])
def create_new_cupcake():
    flavor = request.json["flavor"]
    size = request.json["size"]
    rating = request.json["rating"]
    if "image" in request.json:
        if request.json['image'] == "":
            image = "https://tinyurl.com/demo-cupcake"
        else:
            image = request.json["image"]
    else:
        image = "https://tinyurl.com/demo-cupcake"

    cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)
    db.session.add(cupcake)
    db.session.commit()
    return (jsonify(cupcake=cupcake.serialize()), 201)

@app.route('/api/cupcakes/<cc_id>', methods=['PATCH'])
def update_cupcake(cc_id):
    cupcake = Cupcake.query.get_or_404(cc_id)
    cupcake.flavor = request.json["flavor"]
    cupcake.size = request.json["size"]
    cupcake.rating = request.json["rating"]
    if "image" in request.json:
        cupcake.image = request.json["image"]
    else:
        cupcake.image = "https://tinyurl.com/demo-cupcake"

    db.session.commit()
    return jsonify(cupcake=cupcake.serialize())

@app.route('/api/cupcakes/<cc_id>', methods=['DELETE'])
def delete_cupcake(cc_id):
    cupcake = Cupcake.query.get_or_404(cc_id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message="Deleted")

    