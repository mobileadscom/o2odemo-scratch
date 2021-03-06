const functions = require('firebase-functions');
var express = require('express');
var cors = require('cors');
var axios = require('axios');
var Twit = require('twit');

const app = express();
app.use(cors());

var config = {
  consumer_key: '80zUsPEYotT1eybBcdxaTcW8a',
  consumer_secret: 'Ycod9tpAUPbrVspWmCVylOAr2h33PsliBClh0fOd9A4wL1amw0',
  access_token: '2166166477-SmyNsrVo5djl0mBIDyWqfZevepbYfVuz3LfOSRN',
  access_token_secret: 'ZiLsr1ILUOCOz4bhBMksyaIeTdWCtUFRoTiOEfsCum2yh'
}

var twitterPageId = '2166166477'; // In order for this app to send direct message, the twitter user(audience) has to follow this first.

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/sendMessage', function(req, res) {
  var T = new Twit(config);
  T.post('direct_messages/events/new', {
    "event": {
      "type": "message_create",
      "message_create": {
        "target": {
          "recipient_id": req.body.recipientId
        },
        "sender_id": "2166166477", 
        "message_data": {
          "text": req.body.text
        }
      }
    }
  }, function(err, data, response) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(data);
    }
  });
});

app.post('/followUs', function(req, res) {
  var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: req.body.token,
    access_token_secret: req.body.tokenSecret
  });
  T.post('friendships/create', {
    user_id: twitterPageId
  }, function(err, data, response) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      if (response.statusCode == 200) {
        res.send('followed!');
      }
    }
  });
});

app.post('/getUser', function(req, res) {
  var T = new Twit(config);
  T.get('followers/list', {
    user_id: twitterPageId
  }, function(err, data, response) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      var isFollowing = false;
      for (var u = 0; u < data.users.length; u++) {
        if (data.users[u].id_str == req.body.id) {
          isFollowing = true;
        }
      }

      if (isFollowing) {
        res.send('following');
      }
      else {
        res.send('not following');
      }
    }
  });
});

app.post('/checkFriendship', function(req, res) {
  var T = new Twit(config);
  T.get('friendships/show', {
    source_id: req.body.id,
    target_id: twitterPageId
  }, function(err, data, response) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
     if (data.relationship.source.following) {
      res.send('following');
     }
     else {
      res.send('not following');
     }
    }
  });
});

/* /listenFollow not used anymore */
/*app.post('/listenFollow', function(req, res) {
  var S = new Twit(config);
  var stream = S.stream('user');
  stream.on('follow', function(eventMsg) {
    if (eventMsg.source.id_str == req.body.id) {
      stream.stop();
      res.send('followed!');
    }
  });
});*/

exports.widgets = functions.https.onRequest(app);