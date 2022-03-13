const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/User");

dotenv.config({ path: "./config/.env" });
app.use(express.json());

// Connexion to database

const url = process.env.DB_URI;
mongoose
    .connect(url , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`connected to database with success`))
    .catch((err) => console.log("Connexion to database failed :>>>> " + err));

//CREATE(POST),READ(GET),UPDATE(PUT),DELETE(DELETE)

//create all users

app.post("/user/register", async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({
        username,
        email,
        password,
    });
    try {
        await newUser.save();
        res.send(newUser);
    } catch (error) {
        res.send("Post request error >>" + error);
    }
});

//get all users

app.get("/users", async (req, res) => {
    try {
        let users = await User.find();
        res.send(users);
    } catch (error) {
        res.send("Get request error >>> " + error);
    }
});

//get one user by id

app.get("/users/:id", async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        res.send(user);
    } catch (error) {
        res.send("Get request by id error >>> "+ error);
    }
});


//PUt: edit user by id

app.put("/users/edit/:id", async (req, res) => {
    try {
        let editedUser = await User.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
            );
            res.send("user updated successfully");
        } catch (error) {
            res.send("Update request error >>> " + error);
        }
    });
    
    //delete user by id
    
    app.delete("/users/delete/:id", async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.send("user successfully deleted");
        } catch (error) {
            res.send("Delete request error >>> " + error);
        }
    });

// connection to localhost:8080

const port = process.env.PORT;
app.listen(port, (err) =>
    err ? console.log(err) : console.log(`Server running on port ${port}`)
);
