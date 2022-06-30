const express = require("express");
const app = express();
const gamestateDB = require("./config");

app.use(express.json());

app.get("/gameStates", async (req, res) => {
    let result = await gamestateDB.get();
    const list = [];
    result.forEach((doc) => {
        console.log(doc);
        const data = doc.data();
        data.id = doc.id;
        list.push(data);
    });
    res.send(list);
});

app.put("/gamestate/:id", async (req, res) => {
    let gamestate_id = req.params.id;
    const data = req.body;
    try {
        await gamestateDB.doc(gamestate_id).update(data);
        res.status(204).send("updated");
    } catch (e) {
        res.send(e);
    }
});

app.get("/gamestate/:id", async (req, res) => {
    let state_id = req.params.id;

    try {
        const result = await gamestateDB.doc(state_id).get();
        let data = result.data();
        console.log(data);
        res.send(data);
    } catch (e) {
        res.send(e);
    }
});

module.exports = app;
