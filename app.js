//npm install express jsonwebtoken

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welbome to the API'
    });
});


//Use token to verify the right to access this API
//app.post('/api/posts', (req, res) => {
app.post('/api/posts', verifyToken, (req, res) => {
    // 1. token, 2. signature 
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {

            res.json({
                message: 'Post created',
                authData: authData
            });
        }
    });


});

app.post('/api/login', (req, res) => {
    //Mock user
    const user = {
        id: 1,
        username: 'peng',
        email: 'peng@gmail.com'
    }

    jwt.sign({ user: user }, 'secretkey', {expiresIn: '30s'}, (err, token) => {
        res.json({
            token: token
        });
    });
});

// Verify token funciton
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    //console.log(req.headers);
    //console.log(bearerHeader);

    //Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Format of token
        // Authorization: Bearer <access_token>
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // set the token
        req.token = bearerToken;
        // Next middleware
        next();

    } else {
        // Forbidden
        console.log('Token is not defined');
        res.sendStatus(403);

    }


}

app.listen(5000, () => console.log('Server started on port 5000'));

