const express = require('express');     // Importa o módulo express, um framework web para Node.js
const uuid = require('uuid');           // Importa a função 'v4' do módulo 'uuid' para gerar IDs únicos
const app = express();                  // Cria uma instância do aplicativo Express
app.use(express.json());                // Adiciona o middleware express.json() para fazer parsing do corpo da requisição como JSON
const cors = require('cors');           // Importa o módulo 'cors' para lidar com políticas de compartilhamento de recursos entre diferentes origens
const port = 3003;                      // Define a porta na qual o servidor irá escutar as requisições

// Cria um array vazio para armazenar os pedidos
const orders = [];

// Middleware para logar o método HTTP e a URL de cada requisição
const showMethodAndURL = (req, res, next) => { /// res é declarado mas nunca é lido
    const method = req.method;
    const url = req.url;
    console.log(`Esse é o método: ${method} seguido dessa URL: ${url}`);
    next();
}

// Middleware para verificar se o ID do pedido existe
const checkOrderId = (req, res, next) => {
    const { id } = req.params;
    // Procura o índice do pedido no array de pedidos
    const index = orders.findIndex(order => order.id === id);

    // Se o índice for menor que zero, significa que o pedido não foi encontrado
    if (index < 0) {
        return res.status(404).json({
            message: "order not found"
        });
    }

    // Adiciona o índice e o ID do pedido ao objeto de requisição para uso posterior
    req.orderIndex = index;
    req.orderId = id;
    next();
}

// Rota para buscar todos os pedidos (GET)
app.get('/order', showMethodAndURL, (req, res) => {
    console.log('orders');
    return res.json(orders);
});

// Rota para buscar um pedido específico pelo ID (GET)
app.get('/order/:id', checkOrderId, showMethodAndURL, (req, res) => {
    const index = req.orderIndex;
    return res.json(orders[index]);
});

// Rota para criar um novo pedido (POST)
app.post('/order', showMethodAndURL, (req, res) => {
    const { orderClient, nameClient, priceOrder } = req.body;
    const order = {
        id: uuid.v4(), // Gera um ID único para o pedido
        orderClient,
        nameClient,
        priceOrder,
        statusOrder: "Pedido Realizado" // Define o status do pedido como 'Pedido Realizado'
    };
    orders.push(order); // Adiciona o novo pedido ao array de pedidos
    return res.status(201).json(order); // Retorna o novo pedido com o status '201 Created'
});

// Rota para atualizar um pedido existente pelo ID (PUT)
app.put('/order/:id', checkOrderId, showMethodAndURL, (req, res) => {
    const index = req.orderIndex;
    const id = req.orderId;
    const { orderClient, nameClient, priceOrder } = req.body;
    const updatedOrder = {
        id,
        orderClient,
        nameClient,
        priceOrder,
        statusOrder: "Pedido em preparação" // Define o status do pedido como 'Pedido em preparação'
    };
    orders[index] = updatedOrder; // Substitui o pedido antigo pelo novo no array de pedidos
    return res.json(updatedOrder);
});

// Rota para atualizar parcialmente um pedido existente pelo ID (PATCH)
app.patch('/order/:id', checkOrderId, showMethodAndURL, (req, res) => {
    const index = req.orderIndex;
    const { id } = req.params;
    const { orderClient, nameClient, priceOrder } = req.body;
    const updatedOrder = {
        id,
        orderClient,
        nameClient,
        priceOrder,
        statusOrder: "Pedido pronto" // Define o status do pedido como 'Pedido pronto'
    };
    orders[index] = updatedOrder; // Substitui o pedido antigo pelo novo no array de pedidos
    console.log(updatedOrder);
    return res.json(updatedOrder);
});

// Inicia o servidor Express e escuta na porta especificada que eu quero
app.listen(port, () => {
    console.log(`Leeeet.s Gooo 🚀 ${port}`);
});
