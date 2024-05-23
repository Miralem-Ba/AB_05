const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { createClient } = require('redis');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Ersetzen Sie 'localhost' durch die tatsächliche IP-Adresse oder den Hostnamen Ihrer MongoDB-Instanz
const mongoUri = "mongodb://172.17.250.198,localhost:27017/?replicaSet=rs0";
const mongoClient = new MongoClient(mongoUri);

const redisClient = createClient({
    url: 'redis://172.17.246.196:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function startRedis() {
    await redisClient.connect();
}

async function connectDB() {
    if (!mongoClient.topology || !mongoClient.topology.isConnected()) {
        await mongoClient.connect();
    }
    return mongoClient.db('yourDatabaseName');
}

startRedis().catch(console.error);

app.use(bodyParser.json());

app.get('/orders', async (req, res) => {
    try {
        // Zuerst den Redis Cache abfragen
        const cachedOrders = await redisClient.get('orders');
        if (cachedOrders) {
            console.log('Cache hit'); // Ausgabe, wenn Daten aus dem Cache kommen
            return res.json(JSON.parse(cachedOrders));
        }

        // Wenn nicht im Cache, Daten aus der MongoDB laden
        console.log('Cache miss'); // Ausgabe, wenn Daten aus der MongoDB geladen werden
        const db = await connectDB();
        const orders = await db.collection('orders').find().toArray();

        // Daten in Redis Cache speichern
        await redisClient.setEx('orders', 10, JSON.stringify(orders)); // Set TTL to 10 seconds

        console.log('Serving from MongoDB');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send(error.message);
    }
});

app.post("/orders", async (req, res) => {
    try {
        const order = req.body;
        const result = await req.app.locals.db.collection('orders').insertOne(order);
        res.json(result);
    } catch (err) {
        console.error("Error inserting order:", err);
        res.status(500).send(err.toString());
    }
});

app.put("/orders/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const update = req.body;
        const result = await req.app.locals.db.collection('orders').updateOne(
            { _id: new ObjectId(id) },
            { $set: update }
        );
        res.json(result);
    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).send(err.toString());
    }
});

app.delete("/orders/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await req.app.locals.db.collection('orders').deleteOne(
            { _id: new ObjectId(id) }
        );
        res.json(result);
    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).send(err.toString());
    }
});

app.listen(port, async () => {
    try {
        await connectDB();
        console.log(`Server running at http://localhost:${port}`);
    } catch (err) {
        console.error("Failed to connect to the database:", err);
    }
});
