const { v4: uuidv4 } = require('uuid');

function generateOrderId() {
  const prefix = 'ORD';
  const suffix = '2024'; // Customize your suffix as needed
  const uniquePart = uuidv4(); // Generate a unique UUID

  return `${prefix}-${uniquePart}-${suffix}`;
}


const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Misty00.',
  database: 'scrubber'
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Route to get all customers
app.get('/customers', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Route to add a new customer
app.post('/customers', (req, res) => {
  const { name, phone_number } = req.body;
  db.query('INSERT INTO customers (name, phone_number) VALUES (?, ?)', [name, phone_number], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id: results.insertId, name, phone_number });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// route to create new order
app.post('/orders',(req,res)=>{
    const { customer_id, quantity, unit, total_amount, amount_received } = req.body;


// generate orderid
    const orderID =generateOrderId();

    const query = 'INSERT INTO orders (id,customer_id,quantity,unit,total_amount,amount_recieved) values(?, ?, ?, ?, ?, ?)';
    const values =[orderID,customer_id,quantity,unit,total_amount,amount_received];

    db.query(query,values,(err,results)=> {
        if (err) {
            return res.status(500).send(err);
            }
            res.json({ id: results.insertId, customer_id, quantity, unit, total_amount,
                amount_received });
    });
});
