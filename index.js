const express = require('express');    // Importa o módulo express, um framework web para Node
const uuid = require('uuid');   // Importa a função 'v4' do módulo 'uuid' para gerar IDs únicos
const app = express();       // Cria uma instância do aplicativo Express
app.use(express.json());        // Adiciona o middleware express.json() para fazer parsing do corpo da requisição como JSON
const cors = require('cors');       // Importa o módulo 'cors' para lidar com políticas de compartilhamento de recursos entre diferentes origens
app.use(cors());

const port = 3003;                  // Define a porta na qual o servidor irá escutar as requisições

// Cria um array vazio para armazenar os pedidos
const orders = [];

// Middleware para logar o método HTTP e a URL de cada requisição
const showMethodAndURL = (req, res, next) => {      // res é declarado mas nunca é lido
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

app.post('/order', showMethodAndURL, (req, res) => {
    const { order, clientName } = req.body;
    const newOrder = {
        id: uuid.v4(),
        order,
        clientName,
        statusOrder: "Pedido Realizado" // Define o status do pedido como 'Pedido Realizado'
    };
    orders.unshift(newOrder); // Adiciona o novo pedido no início do array de pedidos
    return res.status(201).json(newOrder);  // Retorna o novo pedido com o status '201 Created'
});


    // Rota para atualizar um pedido existente pelo ID (PUT)
app.put('/order/:id', checkOrderId, showMethodAndURL, (req, res) => {
    const index = req.orderIndex;
    const id = req.orderId;
    const { order, clientName, priceOrder } = req.body;
    const updatedOrder = {
        id,
        order,
        clientName,
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
    const { order, clientName, priceOrder } = req.body;
    const updatedOrder = {
        id,
        order,
        clientName,
        priceOrder,
        statusOrder: "Pedido pronto" // Define o status do pedido como 'Pedido pronto'
    };
    orders[index] = updatedOrder; // Substitui o pedido antigo pelo novo no array de pedidos
    return res.json(updatedOrder);
});


    // Rota para deletar um pedido existente pelo ID (DEL)
app.delete('/order/:id', checkOrderId, (req, res) => {
    const index = req.orderIndex;
    orders.splice(index, 1);
    return res.status(204).end();
});

app.listen(port, () => {
    console.log(`Leeet.s Boraa 🚀${port}`);
});



////// PROJECT FEITO COM NODE
        // - baixar o node_modules
        // - iniciar com npm satrt