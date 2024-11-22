from flask import Flask, request, jsonify  # Importamos Flask y las funciones necesarias
import mysql.connector  # Para conectar con MySQL
from flask_cors import CORS  # Para permitir peticiones desde otros orígenes

# Crear la aplicación Flask
app = Flask(__name__)
CORS(app)  # Habilitar CORS para permitir peticiones desde otros dominios

# Configuración de la conexión a la base de datos MySQL
db = mysql.connector.connect(
    host="localhost",  # Dirección del servidor de base de datos
    user="root",  # Usuario de la base de datos
    password="",  # Contraseña (vacía en este caso)
    database="oziel_stock"  # Nombre de la base de datos
)

# Crear un cursor que se usará para interactuar con la base de datos
cursor = db.cursor(dictionary=True)


# RUTA PARA LOGIN
@app.route('/login', methods=['POST'])
def login():
    # Obtener los datos del cuerpo de la petición
    data = request.json
    email = data.get('email')  # Obtener el email
    password = data.get('password')  # Obtener la contraseña
    
    print("Email recibido:", email)
    print("Password recibido:", password)

    # Verificar si los datos están completos
    if not email or not password:
        return jsonify({'message': 'Faltan datos del usuario'}), 400  # Responder con un error si faltan datos

    # Ejecutar la consulta para buscar al usuario en la base de datos
    cursor.execute("SELECT * FROM customers WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()  # Obtener el primer resultado que coincida

    # Imprimir el resultado de la consulta para depuración
    print("Resultado de la consulta:", user)

    # Verificar si se encontró un usuario
    if user:
        # Si el usuario existe, responder con un mensaje de éxito y los datos del usuario
        return jsonify({'message': 'Inicio de sesión exitoso', 'user': user}), 200
    else:
        # Si no se encontró, responder con un error
        return jsonify({'message': 'Credenciales incorrectas'}), 401


# RUTA PARA OBTENER PRODUCTOS
@app.route('/products', methods=['GET'])
def get_products():
    cursor.execute("SELECT * FROM products")  # Ejecutar la consulta para obtener todos los productos
    products = cursor.fetchall()  # Obtener todos los resultados de la consulta
    return jsonify(products), 200  # Retornar los productos en formato JSON


# Ejecutar la aplicación Flask
if __name__ == '__main__':
    app.run(debug=True)
