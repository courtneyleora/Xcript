import psycopg2
import psycopg2.extras



class UserDatabase:
    def __init__(self, hostname, database, username, password, port_id):
        try:
            self.conn = psycopg2.connect(
                host=hostname,
                dbname=database,
                user=username,
                password=password,
                port=port_id
            )
            self.cur = self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            self.create_table()
        except Exception as error:
            print("Error: ", error)
            if self.conn:
                self.conn.close()
            raise
    
    def create_table(self):
        create_script = ''' CREATE TABLE IF NOT EXISTS users (
            id              int PRIMARY KEY,
            username        VARCHAR(50) NOT NULL,
            password        VARCHAR(50),
            email           VARCHAR(50)) '''
        self.cur.execute('DROP TABLE IF EXISTS users')  # Drop table if it exists (for testing purposes)
        self.cur.execute(create_script)
        self.conn.commit()
    
    def generate_new_user_id(self):
        self.cur.execute('SELECT MAX(id) FROM users')
        max_id = self.cur.fetchone()[0]
        return (max_id + 1) if max_id else 1
    
    def create_user(self, id, password, email):
        username = email.split('@')[0]  # Automatically generate username from email
        insert_script = 'INSERT INTO users (id, username, password, email) VALUES (%s, %s, %s, %s)'
        self.cur.execute(insert_script, (id, username, password, email))
        self.conn.commit()
        
    def validate_user(self, email, password):
        select_script = 'SELECT * FROM users WHERE email = %s AND password = %s'
        self.cur.execute(select_script, (email, password))
        user = self.cur.fetchone()
        return user

    
    def read_all_users(self):
        self.cur.execute('SELECT * FROM users')
        records = self.cur.fetchall()
        for record in records:
            print(record['id'], record['username'], record['password'], record['email'])
    
    def read_user_by_id(self, user_id):
        select_script = 'SELECT * FROM users WHERE id = %s'
        self.cur.execute(select_script, (user_id,))
        record = self.cur.fetchone()
        if record:
            print(record['id'], record['username'], record['password'], record['email'])
        else:
            print("User not found.")
    
    def update_user_email(self, user_id, new_email):
        new_username = new_email.split('@')[0]  # Automatically update username based on new email
        update_script = 'UPDATE users SET email = %s, username = %s WHERE id = %s'
        self.cur.execute(update_script, (new_email, new_username, user_id))
        self.conn.commit()
    
    def delete_user(self, user_id):
        delete_script = 'DELETE FROM users WHERE id = %s'
        self.cur.execute(delete_script, (user_id,))
        self.conn.commit()
    
    def close(self):
        if self.cur:
            self.cur.close()
        if self.conn:
            self.conn.close()

# Example usage
if __name__ == "__main__":
    db = UserDatabase('localhost', 'user', 'postgres', 'cocopop', 10203)
    
    # Demonstrate CRUD operations
    db.create_user(1, 'CourtPass', 'courtneylr2025@gmail.com')
    db.create_user(2, 'LauraPass', 'LauraZap2025@gmail.com')
    db.create_user(3, 'AbelPass', 'Abel2025@gmail.com')
    
    print("\n--- All Users ---")
    db.read_all_users()
    
    print("\n--- Read Specific User by ID ---")
    db.read_user_by_id(1)
    
    print("\n--- Update User Email ---")
    db.update_user_email(1, 'updated1@gmail.com')
    db.read_user_by_id(1)
    
    print("\n--- Delete User ---")
    db.delete_user(2)
    db.read_all_users()
    
    # Close the connection
    db.close()
