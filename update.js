const { MongoClient } = require('mongodb');

async function updateOrder() {
    const uri = "mongodb://username:password@localhost:27017/?replicaSet=rs0";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db("yourDatabaseName");
        const collection = database.collection("orders");

        const filter = { customerName: "Max Mustermann" };
        const updateDoc = { $set: { status: "delivered" } };
        const result = await collection.updateOne(filter, updateDoc);
        console.log(`Matched ${result.matchedCount} document and updated ${result.modifiedCount} document.`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

updateOrder();