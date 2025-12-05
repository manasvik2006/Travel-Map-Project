from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

def save_data(place, distance, time, cost):
    conn = sqlite3.connect("travel.db")
    c = conn.cursor()
    c.execute("INSERT INTO travel_info (place, distance, time, cost) VALUES (?, ?, ?, ?)",
              (place, distance, time, cost))
    conn.commit()
    conn.close()


@app.route("/")
def welcome():
    return render_template("welcome.html")


@app.route("/map")
def home():
    return render_template("index.html")


@app.route("/save", methods=["POST"])
def save():
    data = request.json
    place = data["place"]
    distance = data["distance"]
    time = data["time"]
    cost = data["cost"]

    conn = sqlite3.connect("travel.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO travel_info (place, distance, time, cost) VALUES (?, ?, ?, ?)",
                   (place, distance, time, cost))
    conn.commit()
    conn.close()

    return {"message": "Saved successfully!"}


@app.route("/view")
def view():
    conn = sqlite3.connect("travel.db")
    c = conn.cursor()
    c.execute("SELECT * FROM travel_info")
    rows = c.fetchall()
    conn.close()

    return {"data": rows}


@app.route("/reset", methods=["POST"])
def reset():
    conn = sqlite3.connect("travel.db")
    cur = conn.cursor()
    cur.execute("DELETE FROM travel_info;")
    cur.execute("DELETE FROM sqlite_sequence WHERE name='travel_info';")
    conn.commit()
    conn.close()
    return jsonify({"message": "All data deleted successfully!"})


if __name__ == "__main__":
    app.run(debug=True)

