import psycopg2

# Database connection parameters
hostname = 'localhost'
database = 'user'
username = 'postgres'
pwd = 'cocopop'
port_id = 10203
# create a connection object
conn = None
cur = None

try:
    # open a database connection
    conn = psycopg2.connect(
        host=hostname,
        dbname=database,
        user=username,
        password=pwd,
        port=port_id)


    # create a new cursor: stores the result of a query
    cur = conn.cursor()
    
    
    cur.execute('DROP TABLE IF EXISTS users')
    
    create_script = ''' CREATE TABLE IF NOT EXISTS users (
        id              int PRIMARY KEY,
        username        VARCHAR(50) NOT NULL,
        password        VARCHAR(50),
        email           VARCHAR(50)) '''
    
    
    cur.execute(create_script)
    
    # Adjust insert statement to refer to "users"
    insert_script = 'INSERT INTO users (id, username, password, email) VALUES(%s, %s, %s, %s)'
    insert_vals= [(1, 'Court', 'Court123', 'courtneylr2025@gmail.com'),(2, 'Laura', 'Laura123', 'LauraZap2025@gmail.com'), (3, 'Abel', 'Abel123', 'Abel2025@gmail.com')]
        
    for record in insert_vals:    
        cur.execute(insert_script, record)

    
    conn.commit()
    
except Exception as error:
    print("Error: ", error)
    conn.close()
    exit()
    
# will always be executed
finally:
    # if the cursor was open then close it
    if cur is not None:
        cur.close()
    # if the connection was open then close it
    if conn is not None:
        conn.close()