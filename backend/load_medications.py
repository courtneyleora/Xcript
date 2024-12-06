import json
import psycopg2

def load_medications(json_file, db_config):
    with open(json_file, 'r') as file:
        medications = json.load(file)

    conn = psycopg2.connect(**db_config)
    cur = conn.cursor()

    for medication in medications:
        cur.execute('''
            INSERT INTO medications (name, dosage, prescribed_frequency, ingredient_list, uses, side_effects)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (
            medication['name'],
            medication['dosage'],
            medication['prescribed_frequency'],
            medication['ingredient_list'],
            medication['uses'],
            medication['side_effects']
        ))

    conn.commit()
    cur.close()
    conn.close()

if __name__ == '__main__':
    db_config = {
        'host': 'localhost',
        'dbname': 'Xcript',
        'user': 'postgres',
        'password': 'cocopop',
        'port': 10203
    }
    load_medications('medications.json', db_config)