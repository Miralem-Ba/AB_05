const { createClient } = require('redis');

async function main() {
    const client = createClient({
        url: 'redis://172.17.246.196:6379',
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    await client.set('myKey', 'myValue');
    const value = await client.get('myKey');
    console.log('Stored value:', value);

    await client.disconnect();
}

main().catch(console.error);
