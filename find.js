const { MongoClient } = require('mongodb');

async function findOrders() {
    const uri = "mongodb://username:password@localhost:27017/?replicaSet=rs0";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db("yourDatabaseName");
        const collection = database.collection("orders");

        const orders = await collection.find().toArray();
        console.log("Orders:", orders);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

findOrders();