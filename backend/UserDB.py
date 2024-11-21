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
            self.create_tables()
        except Exception as error:
            print("Error: ", error)
            if self.conn:
                self.conn.close()
            raise
    
    def create_tables(self):
        create_users_table = '''
        CREATE TABLE IF NOT EXISTS Users (
            UserID SERIAL PRIMARY KEY,
            Age INT,
            Sex VARCHAR(10),
            Height DECIMAL(5, 2),
            Weight DECIMAL(5, 2)
        )'''
        
        create_medication_table = '''
        CREATE TABLE IF NOT EXISTS Medication (
            MedicationID SERIAL PRIMARY KEY,
            Name VARCHAR(100),
            SideEffects TEXT,
            IngredientsList TEXT,
            PrescribedFrequency VARCHAR(50),
            DosageMG DECIMAL(10, 2)
        )'''
        
        create_prescription_table = '''
        CREATE TABLE IF NOT EXISTS Prescription (
            PrescriptionID SERIAL PRIMARY KEY,
            UserID INT REFERENCES Users(UserID),
            MedicationID INT REFERENCES Medication(MedicationID),
            StartDate DATE,
            EndDate DATE,
            Goals TEXT
        )'''
        
        create_clinic_table = '''
        CREATE TABLE IF NOT EXISTS Clinic (
            ClinicID SERIAL PRIMARY KEY,
            Name VARCHAR(100),
            Address TEXT,
            DistanceFromUser DECIMAL(10, 2)
        )'''
        
        create_appointment_table = '''
        CREATE TABLE IF NOT EXISTS Appointment (
            AppointmentID SERIAL PRIMARY KEY,
            UserID INT REFERENCES Users(UserID),
            ClinicID INT REFERENCES Clinic(ClinicID),
            Date DATE,
            Time TIME
        )'''
        
        create_user_medication_table = '''
        CREATE TABLE IF NOT EXISTS UserMedication (
            UserMedicationID SERIAL PRIMARY KEY,
            UserID INT REFERENCES Users(UserID),
            MedicationID INT REFERENCES Medication(MedicationID),
            PrescriptionID INT REFERENCES Prescription(PrescriptionID),
            UsageDetails TEXT
        )'''
        
        self.cur.execute(create_users_table)
        self.cur.execute(create_medication_table)
        self.cur.execute(create_prescription_table)
        self.cur.execute(create_clinic_table)
        self.cur.execute(create_appointment_table)
        self.cur.execute(create_user_medication_table)
        self.conn.commit()
    
    def update_user_profile(self, user_id, age, sex, height, weight):
        update_script = '''
        UPDATE Users
        SET Age = %s, Sex = %s, Height = %s, Weight = %s
        WHERE UserID = %s
        '''
        self.cur.execute(update_script, (age, sex, height, weight, user_id))
        self.conn.commit()

    def close(self):
        if self.cur:
            self.cur.close()
        if self.conn:
            self.conn.close()

# Example usage
if __name__ == "__main__":
    db = UserDatabase('localhost', 'user', 'postgres', 'cocopop', 10203)
    db.close()
