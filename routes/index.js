const axios = require('axios');
var express = require('express');
var hbs = require('hbs');
var router = express.Router();

const getNewToken = require('../lib/getNewToken');

hbs.registerHelper({
  date: (start) => {
    return new Intl.DateTimeFormat('en-US').format(new Date(start))
  },
  seats_available: (seats, seats_taken) => {
    return seats - seats_taken
  },
  time: (start) => {
    return new Intl.DateTimeFormat('en-US', {hour: 'numeric' }).format(new Date(start))
  },
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  if (!process.env.ACCESS_TOKEN) { return getNewToken(res) }

  const url = process.env.EVENTS_URL
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
    }
  }
  axios.get(url, config)
  .then(function (response) {
    const events = response.data.events

    res.render('index', {
      title: 'BLDG 61 Calendar',
      events
    });
  })
  .catch(function (error) {
    const connectionError = !error.response
    const tokenError = error.response.data.error_description === 'The access token provided has expired' ||
    error.response.data.error_description === 'The access token provided is invalid'

    if (connectionError) {
      res.render('error', {
        error : {
          status: error.errno,
          stack: 'Oh Noes! Something just did a sads.'
        },
        message: error.code,
      });
    }

    if (tokenError) {
      return getNewToken(res)
    }

    res.render('error', {
      error : {
        status: error.response.status,
        stack: 'Oh Noes! Something about the LibCal API just did a sads.'
      },
      message: error.response.data.error_description,
    });
  })
});

module.exports = router;
