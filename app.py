import os
from flask import Flask , jsonify , request , render_template
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__ , template_folder="templates" , static_folder="static")
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# postgresql://flask_task_manager2_user:mazDDV3hlDN99YBb1EkrVzwqbx8yp3lE@dpg-cv02guin91rc73fjjs60-a.oregon-postgres.render.com/flask_task_manager2
db = SQLAlchemy(app)

class Task(db.Model):
    # __table__ = 'tasks'
    id = db.Column(db.Integer , primary_key = True , autoincrement = True)
    title = db.Column(db.String(200) , nullable = False)
    done = db.Column(db.Boolean , default = False)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks')
def get_tasks():
    tasks = Task.query.all()
    task_list = [
        {'id': task.id , 'title': task.title , 'done': task.done} for task in tasks
    ]
    return jsonify({"tasks" : task_list})


@app.route('/tasks' , methods=['POST'])
def create_task():
    data = request.get_json()
    new_task = Task(title=data['title'] , done=data['done'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message':'Task created'}) , 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    data = request.get_json()
    task.done = data.get('done', task.done)  # Update task's done status
    db.session.commit()

    return jsonify({'message': 'Task updated successfully'})
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}),404
    db.session.delete(task)

    db.session.commit()

    return jsonify({'message':'Task deleted successfully'})
if __name__ == '__main__':
    app.run(debug = True)