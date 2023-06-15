// Purpose: Entry point for the application
import express from "express";

const app = express();
const PORT = 3000;

app.get ("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

app.get ("/users",(req, res) => {
    res.send("<h1>Hello Users!</h1>");
    });

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

// master
