const http = require('http');
const os = require("os");
const userInfo = os.userInfo();
const name = userInfo.username;
const hostname = '0.0.0.0';
const port = 3030;

const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

// Запускаем сервер
const server = http.createServer(async (req, res) => {
  // Извлечь из URL параметр collection (например, /?collection=users)
  const urlParams = new URL(req.url, `http://${req.headers.host}`);
  const collectionName = urlParams.searchParams.get('collection') || 'users';

  try {
    await mongoClient.connect();
    const db = mongoClient.db('test1');

    // Проверяем коллекцию
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Hello ${name}, in collection "${collectionName}" you have ${count} documents.`);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Ошибка при работе с базой данных:\n' + err.message);
  } finally {
    await mongoClient.close();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});