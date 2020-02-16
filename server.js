// Déclarations des dépendances

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// Initialisation de la connexion a la base de données
mongoose.connect('mongodb://localhost/todoList', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// Récuperation des models
let User = require('./models/user');
let List = require('./models/list');
let Task = require('./models/task');


// Déclarations des routes de notre application
app.route('/').get(function(req, res) {
    res.send('hello world !');
});

app.route('/register').post(function(req, res){
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        let user = new User({
            name: req.body.name,
            email: req.body.email, 
            password: hash
        });
            user.save(function(err, data) {
                if (err)
                    res.send('error : ' + err);
                        else
                            res.send(data);
            });
    });
})

app.route('/login').post(function(req, res){
    User.findOne({
        email: req.body.email}, function(err, data) {
            if (data) {
                bcrypt.compare(req.body.password, data.password, function(err, result) {
                    if (result){
                        let token = jwt.sign({id: data._id}, "maclefsecrete");
                        let response = {user: data, token: token};
                            res.send(response);
                    }
                        else
                            res.send('error : ' + err);
                });
            }
                else
                    res.send(err)
    });
});

app.route('/user').get(function(req, res){
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    User.find({}).populate('listid').exec(function(err, data){
                        if (err){
                            res.send(err)
                        }
                            res.send(data);
                        });
                };
    }); 
});

app.route('/user/:id').get(function(req,res){
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    User.findOne({_id: decoded.id}).populate('listid[]').exec(function(err,data){
                        if (err)
                            res.send(err);
                                else
                                    res.send(data);
                    });
                };
    });
        
});

app.route('/updateUser').put(function(req, res) {
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    User.updateOne({_id: decoded.id}, { $set: { listid: req.body['listid[]'] } }, function(err, data) {
                        if (err)
                            res.send(err);
                                else
                                    res.send(data);
                    });
                    };
    });    
});

app.route('/addlist').post(function(req, res) {
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    let list = new List({userid: [decoded.id], title: req.body.title});
                    list.save(function(err, data) {
                    console.log(err);
                        if (err)
                            res.send(err);
                                else
                                    res.send(data);
                    });
                };
    });
});

app.route('/list/:id').get(function(req,res){
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
            if(err)
                res.send(err)
                    else{
                        List.findOne({_id: [decoded.id]}).populate('userid').exec(function(err,data){
                            if (err)
                                res.send(err);
                                    else
                                        res.send(data);
                        });
                    };
    });
});

app.route('/lists').get(function(req, res){
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    List.find({}, function(err, data){
                        if (err)
                            res.send(err);
                                else
                                    res.send(data);
                    });
                };
    });
});

app.route('/updateList').put(function(req, res) {
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{ 
                    List.updateOne({_id: [decoded.id]}, { $set: { title: req.body.title } }, function(err, data) {
                        if (err)
                            res.send(err);
                                else
                                    res.send(data);
                    });
                };
    });
});

app.route('/deleteList/:id').delete(function(req, res) {
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    Task.deleteMany({_id: decoded.id}, function(err, data){
                        if (err)
                            res.send(err);
                                else
                                List.deleteOne({_id: decoded.id}, function(err, data) {
                                    if (err)
                                        res.send(err);
                                            else
                                                res.send(data);
                                });
                    })
                    
                };
    });
});

app.route('/addtask').post(function(req, res) {
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    let task = new Task({listid: [decoded.id], title: req.body.title, done: req.body.done, task: req.body.task});
                        task.save(function(err, data) {
                            if (err)
                                res.send(err);
                                    else
                                        res.send(data);
                        });
                };
    });
});

app.route('/task/:id').get(function(req,res){
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    Task.findOne({_id: decoded.id}).populate('listid').exec(function(err,data){
                        if (err)
                            res.send(err);
                                else
                                    res.send(data);
                    });
                };
    });
});

app.route('/tasks').get(function(req, res){
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    Task.find({}, function(err, data){
                        if (err)
                            res.send(err);
                                else
                                    res.send(data);
                    });
                };
    });
});

app.route('/updateTask').put(function(req, res) {
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    Task.updateOne({_id: decoded.id}, { $set: { title: req.body.title, done: req.body.done } }, function(err, data) {
                        if (err)
                            res.send(err);
                                else
                                    res.send(data);
                    });
                };
    });
});

app.route('/deleteTask').delete(function(req, res) {
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded){
        if(err)
            res.send(err)
                else{
                    Task.deleteOne({_id: decoded.id}, function(err, data) {
                        if (err)
                            res.send(err);
                                else
                                    res.send(data);
                    });
                };
    });   
});

// Mise en écoute de notre application (sur le port 3000)
app.listen(8080);
