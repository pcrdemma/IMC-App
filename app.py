from flask import Flask, render_template, request, jsonify
import mysql.connector
import os
from datetime import datetime

app = Flask(__name__)

# Configuration de la connexion à la base de données
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', 'root'),
    'database': os.environ.get('DB_NAME', 'imc_db')
}

def get_db_connection():
    """Établit une connexion à la base de données MySQL"""
    conn = mysql.connector.connect(**DB_CONFIG)
    return conn

def init_db():
    """Crée la table si elle n'existe pas"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS calculs_imc (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(100),
            poids FLOAT NOT NULL,
            taille FLOAT NOT NULL,
            imc FLOAT NOT NULL,
            categorie VARCHAR(50),
            date_calcul DATETIME
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

def calculer_categorie(imc):
    """Retourne la catégorie de l'IMC selon les normes OMS"""
    if imc < 18.5:
        return "Insuffisance pondérale"
    elif imc < 25:
        return "Corpulence normale"
    elif imc < 30:
        return "Surpoids"
    elif imc < 35:
        return "Obésité modérée"
    elif imc < 40:
        return "Obésité sévère"
    else:
        return "Obésité morbide"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculer', methods=['POST'])
def calculer():
    try:
        data = request.get_json()
        nom = data.get('nom', 'Anonyme')
        poids = float(data.get('poids'))
        taille = float(data.get('taille')) / 100  # cm -> m

        if poids <= 0 or taille <= 0:
            return jsonify({'erreur': 'Valeurs invalides'}), 400

        imc = round(poids / (taille ** 2), 2)
        categorie = calculer_categorie(imc)

        # Sauvegarde en base de données
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO calculs_imc (nom, poids, taille, imc, categorie, date_calcul) VALUES (%s, %s, %s, %s, %s, %s)",
            (nom, poids, taille * 100, imc, categorie, datetime.now())
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            'imc': imc,
            'categorie': categorie
        })

    except Exception as e:
        return jsonify({'erreur': str(e)}), 500

@app.route('/historique', methods=['GET'])
def historique():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM calculs_imc ORDER BY date_calcul DESC LIMIT 20")
    resultats = cursor.fetchall()
    cursor.close()
    conn.close()
    # Formatage de la date pour JSON
    for r in resultats:
        r['date_calcul'] = r['date_calcul'].strftime('%Y-%m-%d %H:%M:%S')
    return jsonify(resultats)

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)