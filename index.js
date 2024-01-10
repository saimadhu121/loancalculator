const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const url = 'mongodb://localhost:27017'; // Your MongoDB URL
const dbName = 'calculatorDB'; // Your database name
const collectionName = 'tasks'; // Collection name for tasks

let db;
let tasksCollection;

async function connectToDatabase() {
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB:', client.topology.isConnected()); // Updated line

        db = client.db(dbName);
        tasksCollection = db.collection(collectionName);

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}


connectToDatabase();

app.post('/tasks', async (req, res) => {
    try {
        const { loanAmount, interestRate, loanTerm } = req.body;
        console.log('Received data:', req.body); // Log received data

        // Check if loan data is empty or not properly formatted
        if (!loanAmount || !interestRate || !loanTerm || isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
            throw new Error('Invalid data received');
        }

        const rate = interestRate / 100;
        const monthlyInterest = rate / 12;
        const totalPayment = loanAmount * (monthlyInterest / (1 - Math.pow(1 + monthlyInterest, -loanTerm)));
        const monthlyPayment = totalPayment / loanTerm;

        const taskData = {
            loanAmount: parseFloat(loanAmount),
            interestRate: parseFloat(interestRate),
            loanTerm: parseInt(loanTerm),
            monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
            totalPayment: parseFloat(totalPayment.toFixed(2))
        };
        console.log('Task data to be inserted:', taskData);
        // Insert received data into MongoDB
        console.log('Before insertion');
        const result = await tasksCollection.insertOne(taskData);
        console.log('Inserted data:', result.ops); // Log the inserted data
        res.status(201).json(taskData);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the serverS
// This line is typically placed at the end of the code, outside of functions
// But it might be automatically executed in the previous code
// Make sure it's not duplicated if already present in your actual code
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
