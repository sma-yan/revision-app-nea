
from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import re

app = Flask(__name__)
app.secret_key = "smayan"

# Database setup
def init_sqlite_db():
    conn = sqlite3.connect('revision_app.db')
    c = conn.cursor()
    c.execute('''
              CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              full_name TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL
              )
              ''')
    
    conn.commit()
    conn.close()



def init_task_table():
    conn = sqlite3.connect('revision_app.db')
    c = conn.cursor()
    c.execute('''
              CREATE TABLE IF NOT EXISTS tasks (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER,
              title TEXT NOT NULL,
              description TEXT,
              due_date TEXT,
              status TEXT DEFAULT 'pending',
              FOREIGN KEY(user_id) REFERENCES users(id)
              )
              ''')
    conn.commit()
    conn.close()




def init_notes_table():
    conn = sqlite3.connect('revision_app.db')
    c = conn.cursor()
    c.execute('''
              CREATE TABLE IF NOT EXISTS notes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER,
              title TEXT NOT NULL,
              content TEXT,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(user_id) REFERENCES users(id)
              )
              ''')
    conn.commit()
    conn.close()


# Call the function to initialize the user, task, notes table
init_sqlite_db()
init_task_table()
init_notes_table()



# Index Route (Main page after login)
@app.route('/')
def index():
    if 'user_id' in session:
        return render_template("index.html")    
    else:
        # flash('Please log in to access the home page', 'warning')
        return redirect(url_for('login'))

# Signup Route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        full_name=request.form['full_name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        # Validate input fields
        if not full_name or not email or not password:
            flash('All fields are required.', 'danger')
            return redirect(url_for('signup'))
        
        # Server-side Password Validation
        password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

        if not re.match(password_regex, password):
            flash("Password must be at least 8 characters long, contain an uppercase letter, lowercase letter, a number, and a special character.", "danger")
            return redirect(url_for('signup'))
        
        # check if the password is same as confirm password field in teh signup form
        if password != confirm_password:
            flash("Passwords do not match.", "danger")
            return redirect(url_for('signup'))
        
        # Creating a hashed password for security
        hashed_password = generate_password_hash(password)
        # print("Hashed Password:", hashed_password)

        try:
            # Creating a connection with the database and insert the user details in the user table
            conn = sqlite3.connect('revision_app.db')
            c = conn.cursor()
            c.execute('INSERT INTO users (full_name, email, password) values (?, ?, ?)', (full_name, email, hashed_password))
            conn.commit()
            conn.close()

            flash('Signup Successful! Please login.', 'success')
            return redirect(url_for('login'))
        
        except sqlite3.IntegrityError:
            flash('Email already exists. Please choose a different email.', 'danger')
            redirect(url_for('signup'))
    return render_template('signup.html')


# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']     
        print(f"Email: , {email} | Password: {password} ")
        
        # Validate input fields
        if not email or not password:
            flash('Both email and password are required.', 'danger')
            return redirect(url_for('login'))
        
        # Server-side Password Validation
        password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

        if not re.match(password_regex, password):
            flash("Invalid password format. Ensure it meets all security requirements.", "danger")
            return redirect(url_for('login'))
        
        # connecting to the database and retrieving user details
        conn = sqlite3.connect('revision_app.db')
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = c.fetchone()
        print("User:", user)
        conn.close()

        # comparing user credentials
        if user and check_password_hash(user[3], password):
            session['user_id'] = user[0]
            session['full_name'] = user[1]
            session['first_name'] = user[1].split()[0].capitalize()
            print("Session user:", session['user_id'], session['full_name'], session['first_name'])
            flash(f'Welcome, {session["first_name"]}!', 'success')
            # flash('Login Successful!!!', 'success')
            return redirect(url_for('index'))
    
        else:
            flash('Invalid email or password. Please try again.', 'danger')
            return redirect(url_for('login'))
    return render_template('login.html')


# Logout route
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('first_name', None)
    # flash('You have been logged out.', 'success')
    return redirect(url_for('login'))

############### CLOCKS ###############
@app.route('/clocks')
def clocks():
    return render_template('clocks.html')

############### GRADE CALCULATOR ###############
@app.route('/grade_calculator')
def grade_calculator():
    return render_template('grade_calculator.html')


############### TO DO ###############

# To-Do List Route - display tasks for logged-in user
@app.route('/todo')
def todo():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    # Connect to the database and retrieve the tasks based on logged-in user id
    conn = sqlite3.connect('revision_app.db')
    c = conn.cursor()
    c.execute('SELECT * FROM tasks WHERE user_id = ?', (user_id,))
    tasks = c.fetchall()
    conn.close()

    return render_template('todo.html', tasks=tasks)


# Route to add a new task
@app.route('/add_task', methods=['POST'])
def add_task():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    # mapping the task details entered by the user
    user_id = session['user_id']
    title = request.form['title']
    description = request.form.get('description', '')
    due_date = request.form['due_date']


    # check if the title of the task is present, and insert task details in the database
    if title:
        conn = sqlite3.connect('revision_app.db')
        c = conn.cursor()
        c.execute('''
            INSERT INTO tasks (user_id, title, description, due_date)
            VALUES (?, ?, ?, ?)
        ''', (user_id, title, description, due_date))
        conn.commit()
        conn.close()

    return redirect(url_for('todo'))


# Route to mark task as complete
@app.route('/complete_task/<int:task_id>')
def complete_task(task_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))


    # Connecting to the database and updating the task status
    conn = sqlite3.connect('revision_app.db')
    c = conn.cursor()
    c.execute('UPDATE tasks SET status = ? WHERE id = ?', ('complete', task_id))
    conn.commit()
    conn.close()

    return redirect(url_for('todo'))


# Route to delete a task
@app.route('/delete_task/<int:task_id>')
def delete_task(task_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))


    # Connecting to the database and initiating deletion
    conn = sqlite3.connect('revision_app.db')
    c = conn.cursor()
    c.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    conn.commit()
    conn.close()

    return redirect(url_for('todo'))


############### NOTES ###############
# Route to display all notes of the logged-in user
@app.route('/notes', methods=['GET', 'POST'])
def notes():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']

    # If user is submitting a new note
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']


        # Connecting to the database and insert notes in the DB
        conn = sqlite3.connect('revision_app.db')
        c = conn.cursor()
        c.execute('INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)', 
                  (user_id, title, content))
        conn.commit()
        conn.close()

        return redirect(url_for('notes'))

    # Fetch all the notes for the logged-in user
    conn = sqlite3.connect('revision_app.db')
    c = conn.cursor()
    c.execute('SELECT * FROM notes WHERE user_id = ? ORDER BY timestamp DESC', (user_id,))
    notes = c.fetchall()
    conn.close()

    return render_template('notes.html', notes=notes)

# Route to edit a note
@app.route('/edit_note/<int:note_id>', methods=['GET', 'POST'])
def edit_note(note_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    conn = sqlite3.connect('revision_app.db')
    c = conn.cursor()

    # When user submits the updated note
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        # Update query to update the notes details in the database
        c.execute('UPDATE notes SET title = ?, content = ?, timestamp = CURRENT_TIMESTAMP WHERE id = ?',
                  (title, content, note_id))
        conn.commit()
        conn.close()

        return redirect(url_for('notes'))

    # Fetch the note to be edited
    c.execute('SELECT * FROM notes WHERE id = ?', (note_id,))
    note = c.fetchone()
    conn.close()

    return render_template('edit_note.html', note=note)

# Route to delete a note
@app.route('/delete_note/<int:note_id>')
def delete_note(note_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    # Connecting to the database and to initiate deletion of the notes
    conn = sqlite3.connect('revision_app.db')
    c = conn.cursor()
    c.execute('DELETE FROM notes WHERE id = ?', (note_id,))
    conn.commit()
    conn.close()

    return redirect(url_for('notes'))


if __name__ == '__main__':
    app.run(debug=True)