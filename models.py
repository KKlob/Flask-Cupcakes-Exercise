"""Models for Cupcake app."""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import backref

db = SQLAlchemy()

def connect_db(app):
    db.app = app
    db.init_app(app)

class Cupcake(db.Model):
    """Cupcake model"""

    __tablename__ = "cupcakes"

    id = db.Column(db.Integer,
                    primary_key=True,
                    autoincrement=True)
    flavor = db.Column(db.String(30),
                    nullable=False)
    size = db.Column(db.String(20),
                    nullable=False)
    rating = db.Column(db.Float,
                        nullable=False)
    image = db.Column(db.Text,
                        default="https://tinyurl.com/demo-cupcake")

    def serialize(self):
        """Serialize self for jsonification"""
        return {'id': self.id,
                'flavor': self.flavor,
                'size': self.size,
                'rating': self.rating,
                'image': self.image}