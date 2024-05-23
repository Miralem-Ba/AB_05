const { MongoClient } = require('mongodb');

async function insertOrder(order) {
    const uri = "mongodb://username:password@localhost:27017/?replicaSet=rs0";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db("yourDatabaseName");
        const collection = database.collection("orders");

        const result = await collection.insertOne(order);
        console.log(`New order created with the following id: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

const order = {
    customerName: "Max Mustermann",
    orderDate: "2024-05-01",
    deliveryAddress: {
        street: "Main Street 10",
        city: "Berlin",
        zip: "10115"
    },
    products: [
        { productId: "A123", name: "Laptop Pro", quantity: 1, price: 1499.99 },
        { productId: "A124", name: "USB-C Charging Adapter", quantity: 2, price: 19.99 }
    ],
    paymentMethod: "Credit Card",
    status: "shipped"
};

insertOrder(order);