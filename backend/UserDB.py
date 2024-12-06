import psycopg2
import psycopg2.extras

class UserDatabase:
    def __init__(self, hostname, database, username, password, port_id):
        self.conn = None
        self.cur = None
        try:
            self.conn = psycopg2.connect(
                host=hostname,
                dbname=database,
                user=username,
                password=password,
                port=port_id
            )
            self.cur = self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            self.create_tables()
        except Exception as error:
            print("Error: ", error)
            if self.conn:
                self.conn.close()
            raise

    def create_tables(self):
        table_scripts = [
            '''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                password VARCHAR(50),
                email VARCHAR(50) UNIQUE
            )''',
            '''
            CREATE TABLE IF NOT EXISTS user_stats (
                user_id INT PRIMARY KEY REFERENCES users(id),
                name VARCHAR(50),
                age INT,
                sex VARCHAR(10),
                height FLOAT,
                weight FLOAT,
                illnesses TEXT,
                background TEXT
            )''',
            '''
            CREATE TABLE IF NOT EXISTS medications (
                medication_id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                dosage INT NOT NULL,
                prescribed_frequency VARCHAR(50),
                ingredient_list TEXT,
                uses TEXT,
                side_effects TEXT
            )''',
            '''
            CREATE TABLE IF NOT EXISTS prescriptions (
                prescription_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id),
                medication_id INT REFERENCES medications(medication_id),
                start_date DATE,
                end_date DATE,
                reminder_time TIME,
                goals TEXT
            )''',
            '''
            CREATE TABLE IF NOT EXISTS educational_facts (
                fact_id SERIAL PRIMARY KEY,
                medication_id INT REFERENCES medications(medication_id),
                fact_detail TEXT
            )'''
        ]
        for script in table_scripts:
            self.cur.execute(script)
        self.conn.commit()

    def validate_user(self, email, password):
        try:
            query = '''
            SELECT * FROM users
            WHERE email = %s AND password = %s
            '''
            self.cur.execute(query, (email, password))
            user = self.cur.fetchone()
            return user
        except Exception as e:
            print(f"Error validating user: {e}")
            return None

    def create_user(self, username, password, email):
        try:
            insert_script = '''
            INSERT INTO users (username, password, email)
            VALUES (%s, %s, %s) RETURNING id
            '''
            self.cur.execute(insert_script, (username, password, email))
            user_id = self.cur.fetchone()[0]
            self.conn.commit()
            return user_id
        except Exception as e:
            self.conn.rollback()
            print(f"Error creating user: {e}")
            return None

    def add_user_stats(self, user_id, name, age, sex, height, weight, illnesses, background):
        try:
            insert_script = '''
            INSERT INTO user_stats (user_id, name, age, sex, height, weight, illnesses, background)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            '''
            self.cur.execute(insert_script, (user_id, name, age, sex, height, weight, illnesses, background))
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print(f"Error adding user stats: {e}")

    def close(self):
        if self.cur:
            self.cur.close()
        if self.conn:
            self.conn.close()
