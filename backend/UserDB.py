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
                user_id SERIAL PRIMARY KEY,
                height INT,
                weight FLOAT,
                age INT,
                illnesses TEXT,
                background TEXT,
                sex VARCHAR(10)
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
                goals TEXT,
                taken_history JSON DEFAULT '[]'
            )''',
            '''
            CREATE TABLE IF NOT EXISTS educational_facts (
                fact_id SERIAL PRIMARY KEY,
                medication_id INT REFERENCES medications(medication_id),
                fact_detail TEXT
            )''',
            '''
            CREATE TABLE IF NOT EXISTS reminders (
                reminder_id SERIAL PRIMARY KEY,
                prescription_id INT REFERENCES prescriptions(prescription_id),
                reminder_time TIME NOT NULL,
                is_active BOOLEAN DEFAULT TRUE
            )'''
        ]
        for script in table_scripts:
            self.cur.execute(script)
        self.conn.commit()

    def create_user(self, username, password, email):
        insert_script = 'INSERT INTO users (username, password, email) VALUES (%s, %s, %s) RETURNING id'
        try:
            self.cur.execute(insert_script, (username, password, email))
            user_id = self.cur.fetchone()[0]
            self.conn.commit()
            return user_id
        except Exception as e:
            self.conn.rollback()
            print(f"Error creating user: {e}")
            return None

    def validate_user(self, email, password):
        select_script = 'SELECT * FROM users WHERE email = %s AND password = %s'
        self.cur.execute(select_script, (email, password))
        user = self.cur.fetchone()
        return user

    def add_user_stats(self, user_id, height, weight, age, illnesses, background, sex):
        insert_script = 'INSERT INTO user_stats (user_id, height, weight, age, illnesses, background, sex) VALUES (%s, %s, %s, %s, %s, %s, %s)'
        self.cur.execute(insert_script, (user_id, height, weight, age, illnesses, background, sex))
        self.conn.commit()

    def read_all_user_stats(self):
        self.cur.execute('SELECT * FROM user_stats')
        records = self.cur.fetchall()
        return records

    def update_user_stats(self, user_id, height, weight, age, illnesses, background, sex):
        update_script = 'UPDATE user_stats SET height = %s, weight = %s, age = %s, illnesses = %s, background = %s, sex = %s WHERE user_id = %s'
        self.cur.execute(update_script, (height, weight, age, illnesses, background, sex, user_id))
        self.conn.commit()

    def delete_user_stats(self, user_id):
        delete_script = 'DELETE FROM user_stats WHERE user_id = %s'
        self.cur.execute(delete_script, (user_id,))
        self.conn.commit()

    def user_stats_exist(self, user_id):
        select_script = 'SELECT 1 FROM user_stats WHERE user_id = %s'
        self.cur.execute(select_script, (user_id,))
        return self.cur.fetchone() is not None

    def add_reminder(self, prescription_id, reminder_time):
        insert_script = 'INSERT INTO reminders (prescription_id, reminder_time) VALUES (%s, %s)'
        self.cur.execute(insert_script, (prescription_id, reminder_time))
        self.conn.commit()

    def get_medication_history(self, user_id):
        select_script = '''
        SELECT m.name, m.dosage, m.prescribed_frequency, m.ingredient_list, m.uses, m.side_effects
        FROM medications m
        JOIN prescriptions p ON m.medication_id = p.medication_id
        WHERE p.user_id = %s
        '''
        self.cur.execute(select_script, (user_id,))
        records = self.cur.fetchall()
        return records

    def update_medication(self, prescription_id, medication_id, start_date, end_date, reminder_time, goals):
        update_script = '''
        UPDATE prescriptions
        SET medication_id = %s, start_date = %s, end_date = %s, reminder_time = %s, goals = %s
        WHERE prescription_id = %s
        '''
        self.cur.execute(update_script, (medication_id, start_date, end_date, reminder_time, goals, prescription_id))
        self.conn.commit()

    def delete_medication(self, prescription_id):
        delete_script = 'DELETE FROM prescriptions WHERE prescription_id = %s'
        self.cur.execute(delete_script, (prescription_id,))
        self.conn.commit()

    def get_all_medications(self):
        select_script = 'SELECT * FROM medications'
        self.cur.execute(select_script)
        records = self.cur.fetchall()
        return records

    def close(self):
        if self.cur:
            self.cur.close()
        if self.conn:
            self.conn.close()