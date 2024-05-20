const express = require("express");
const uuid = require("uuid");
const app = express();
app.use(express.json());

/* 
    - GET          => Buscar informação no back-end
    - POST         => Criar informação no back-end
    - PUT / PATCH  => Alterar/Atualizar informação no back-end
    - DELETE       => Deletar informação no back-end

    - Middleware   => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição
*/

const users = [];

const checkUserId = (request, response, next) => {
    const { id } = request.params;

    const index = users.findIndex((user) => user.id === id);

    if (index < 0) {
        return response.status(404).json({ error: "User not found" });
    }

    request.userIndex = index;
    request.userId = id;

    next();
};

// Mostrar usuario
app.get("/users", (request, response) => {
    return response.json(users);
});

// Criar usuario
app.post("/users", (request, response) => {
    const { name, age } = request.body; // pegando o usuario criado no request body

    const user = { id: uuid.v4(), name, age }; // adicionado esse usuario + o id na variavel user

    users.push(user); // adicionando a variavel user no array users

    return response.status(201).json(user);
});

// Atualizar usuario
app.put("/users/:id", checkUserId, (request, response) => {
    //const { id } = request.params; // pego o id do usuario que vou atualizar
    const { name, age } = request.body; // pego as informações que quero atualizar
    const index = request.userIndex;
    const id = request.userId;

    const updateUser = { id, name, age }; // pego as informações e id e salvo na variavel updateUser

    users[index] = updateUser; // atualizo o usuario de acordo com o index do array

    return response.json(updateUser);
    /*
        // procuro o index do usuario no array com o id e salvo o index na variavel index
        const index = users.findIndex((user) => user.id === id);

        if (index < 0) {
            // mensagem de erro
            return response.status(404).json({ message: "User not found" });
        }
    */
});

// Deletar usuario
app.delete("/users/:id", checkUserId, (request, response) => {
    //const { id } = request.params; // pego o id do usuario que vou atualizar
    const index = request.userIndex;

    /*
        // procuro o index do usuario no array com o id e salvo o index na variavel index
        const index = users.findIndex((user) => user.id === id);

        if (index < 0) {
            // mensagem de erro
            return response.status(404).json({ message: "User not found" });
        }
    */

    users.splice(index, 1); // deleto o usuario de acordo com o index do array

    return response.status(204).json(users);
});

app.listen(3000, () => {
    console.log(`🚀 Server started on port 3000`);
});
