require('dotenv').config();
var express = require('express');
var path = require('path');
var app = express();
var router = express.Router();
const PORT = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); 
var qs = require('querystring');
var that = this;
//web-push
// const webpush = require('web-push');
// const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
// const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
var pushSubscriptionTest; //your subscription object
// This is the same output of calling JSON.stringify on a PushSubscription
// webpush.setVapidDetails('mailto:patricio.dibacco@acrovia.net', publicVapidKey, privateVapidKey);

app.use(express.static(path.join(__dirname, 'public')));

//added dirty db:
var dirty = require('dirty');
var db = dirty('user.db');
//washing machine status:
var statusOne = true;
var statusTwo = true;
var statusThree = true;
var currentUserOne = 'La machine est libre pour le moment.';
var currentUserTwo = 'La machine est libre pour le moment.';
var currentUserThree = 'La machine est libre pour le moment.';
// io.on('connection', function (socket) {
//   console.log('a user connected');
// });
http.listen(PORT, function () {
  console.log('listening on *:3000');
});
//change countdown for general variable:
var countdownOne, countdownTwo, countdownThree;
function clearCounter(what) {
  clearInterval(what);
}
var settimerFunction;
//web-push:
// app.post('/subscribe', (req, res) => {
//   const subscription = req.body;
//   pushSubscriptionTest = req.body;
//   res.status(201).json({});
//   const payload = JSON.stringify({ title: 'Washing Machine' });

//   console.log(subscription);

//   webpush.sendNotification(subscription, payload).catch(error => {
//     console.error(error.stack);
//   });
// });
// save username:
var userName;
app.post('/user', function (req, res) {
  var datainfo;
  console.log('user is: ', req.body);
  userName = req.body.name;
  db.set('user', { name: userName });
  console.log('Added user, he has name: ', db.get('user').name);
  res.send('ok');
});
app.get('/showlast', function (req, res) {
  console.log('Last user, he/she has name:.', db.get('user').name);
  var usersend = db.get('user').name;
  //res.send('last');
  res.send(usersend);
});
app.post('/time1', function (req, res) {
  console.log('time is: ', req.body);
  countdownOne = req.body.time;
  statusOne = false;
  currentUserOne = req.body.user;
  currentMachine = req.body.machine;
  console.log('current user?', currentUserOne);
  console.log('current machine?', currentMachine);
  io.sockets.emit('status1', { status: statusOne, machine: currentMachine });
  io.sockets.emit('currentUser1', { currentuser: currentUserOne, machine: currentMachine });
  settimerFunction = setInterval(function () {
    if (statusOne === false) {
      countdownOne--;
      //convert values to mins:
      var minutes = Math.floor(countdownOne / 60);
      var seconds = countdownOne % 60;
      io.sockets.emit('timer1', { countdown: minutes + ':' + seconds });
      console.log('countdownOne: ', countdownOne);
      if (countdownOne == 0) {
        console.log('countdownOne is 0');
        // console.log('suscription is:', pushSubscriptionTest);
        // webpush.sendNotification(pushSubscriptionTest, JSON.stringify({ title: '1 !!!' }));
        clearCounter(this);
        statusOne = true;
        io.sockets.emit('status1', { status: statusOne });
      }
    }
  }, 1000);
  //console.log('time is:', countdown);
  //res.send('ok time!');
});
app.post('/time2', function (req, res) {
  console.log('time is: ', req.body);
  countdownTwo = req.body.time;
  statusTwo = false;
  currentUserTwo = req.body.user;
  currentMachine = req.body.machine;
  console.log('current user?', currentUserTwo);
  console.log('current machine?', currentMachine);
  io.sockets.emit('status2', { status: statusTwo, machine: currentMachine });
  io.sockets.emit('currentUser2', { currentuser: currentUserTwo, machine: currentMachine });
  settimerFunction = setInterval(function () {
    if (statusTwo === false) {
      countdownTwo--;
      //convert values to mins:
      var minutes = Math.floor(countdownTwo / 60);
      var seconds = countdownTwo % 60;
      io.sockets.emit('timer2', { countdown: minutes + ':' + seconds });
      console.log('countdownTwo: ', countdownTwo);
      if (countdownTwo == 0) {
        console.log('countdownTwo is 0');
        // console.log('suscription is:', pushSubscriptionTest);
        // webpush.sendNotification(pushSubscriptionTest, JSON.stringify({ title: '2 !!!' }));
        clearCounter(this);
        statusTwo = true;
        io.sockets.emit('status2', { status: statusTwo });
      }
    }
  }, 1000);
  //console.log('time is:', countdown);
  //res.send('ok time!');
});
app.post('/time3', function (req, res) {
  console.log('time is: ', req.body);
  countdownThree = req.body.time;
  statusThree = false;
  currentUserThree = req.body.user;
  currentMachine = req.body.machine;
  console.log('current user?', currentUserThree);
  console.log('current machine?', currentMachine);
  io.sockets.emit('status3', { status: statusThree, machine: currentMachine });
  io.sockets.emit('currentUser3', { currentuser: currentUserThree, machine: currentMachine });
  settimerFunction = setInterval(function () {
    if (statusThree === false) {
      countdownThree--;
      //convert values to mins:
      var minutes = Math.floor(countdownThree / 60);
      var seconds = countdownThree % 60;
      io.sockets.emit('timer3', { countdown: minutes + ':' + seconds });
      console.log('countdownThree: ', countdownThree);
      if (countdownThree == 0) {
        console.log('countdownOne is 0');
        // console.log('suscription is:', pushSubscriptionTest);
        // webpush.sendNotification(pushSubscriptionTest, JSON.stringify({ title: '1 !!!' }));
        clearCounter(this);
        statusThree = true;
        io.sockets.emit('status3', { status: statusThree });
      }
    }
  }, 1000);
  //console.log('time is:', countdown);
  //res.send('ok time!');
});
app.post('/cancel_1', function (req, res) {
  console.log('cancel is: ', req.body);
  statusOne = true;
  io.sockets.emit('status1', { status: statusOne });
  clearInterval(settimerFunction);
  res.send('ok cancel 1');
});
app.post('/cancel_2', function (req, res) {
  console.log('cancel is: ', req.body);
  statusTwo = true;
  io.sockets.emit('status2', { status: statusTwo });
  clearInterval(settimerFunction);
  res.send('ok cancel 2');
});
app.post('/cancel_3', function (req, res) {
  console.log('cancel is: ', req.body);
  statusThree = true;
  io.sockets.emit('status3', { status: statusThree });
  clearInterval(settimerFunction);
  res.send('ok cancel 3');
});
app.post('/lastuser', function (req, res) {
  var datainfo;
  console.log('last user is: ', req.body);
  //currentUser = req.body.name;
  //db.update('user', { date: req.body.date });
  console.log('Updated user, he has name: ', req.body.name);
  res.send('ok update last user');
});
//socket io:
io.sockets.on('connection', function (socket) {
  io.emit('status1', { status: statusOne });
  io.emit('status2', { status: statusTwo });
  io.emit('status3', { status: statusThree });
  io.emit('currentUser1', { currentuser: currentUserOne });
  io.emit('currentUser2', { currentuser: currentUserTwo });
  io.emit('currentUser3', { currentuser: currentUserThree });
  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
});