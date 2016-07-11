#!/usr/bin/env node

var libs      = process.cwd() + '/libs/';
var request   = require("request");
var cheerio   = require("cheerio");
var string    = require('string');
var moment    = require('moment');
var mongoose  = require('mongoose');
var async     = require('async');
var colors    = require('colors');
var argv      = require('yargs').argv;

var Podcast   = require('../app/models/podcast');
var Section   = require('../app/models/section');

var unprotectUrl  = "https://linkdecrypter.com/"
var websiteUrl    = "http://podcast-non-officiel.blogspot.fr/"
var protectedUrl  = "http://bit.ly/"

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

function getSections() {

  return new Promise(function(resolve, reject) {
    var sections = [];

    request({
      uri: websiteUrl,
    }, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
          var $ = cheerio.load(body);

          $("#PageList1 > div > ul > li > a").each(function (i, elem) {
            var name = $(this).text();
            var url = $(this).attr('href');

            if (string(url).startsWith('http://podcast-non-officiel.blogspot.') && url !== websiteUrl) {
              sections.push({name: name, url: url})
            }
          });

          resolve(sections);
      }
    })
  })
}

function processPodcast(params, callback) {

  if (!params.section.url) {
    return callback("Error : url is not defined")
  }

  request({
    uri: params.section.url,
  }, function(error, response, body) {
    var $ = cheerio.load(body);

    var result = [];

    $("div.post.hentry").each(function() {
      var link = $(this);

      var name = link.find('h3.post-title.entry-title > a').text();
      var url = link.find('div.post-body.entry-content > a').attr('href');

      // sometimes
      if (!url) url = link.find('div.post-body.entry-content > span > a').attr('href');

      if (!url) console.error("url undefined for : %s.".warn, name);

      var upload_time = new Date(link.find('a.timestamp-link > abbr').attr('title'));
      var date = moment(string(link.find('h3.post-title.entry-title > a').text()).splitRight(' ', 1)[1], "DD/MM/YYYY").toDate();

      var isProtected = url ? string(url).startsWith(protectedUrl) : false;

      result.push({
        name: name,
        url: url || "",
        isProtected: isProtected,
        upload_time: upload_time,
        date: date
      });

    });

    var next = $('#Blog1_blog-pager-older-link').attr('href');

    params.progress(params.section, result);

    var recursive = params.recursive || false;
    if (next !== undefined && recursive === true) {
      params.section.url = next;
      processPodcast(params, callback);
    } else {
      callback();
    }

  });
}

mongoose.connection.on("connected", function(ref) {
  console.log("Connected to %s DB!".debug, mongoDbUrl);
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.error('Failed to connect to DB %s on startup'.debug, mongoDbUrl);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB : %s disconnected'.debug, mongoDbUrl);
});

var db = mongoose.connect(mongoDbUrl);

getSections()
  .then(function(result) {
    var asynFunc = [];
    for (var i = 0; i < result.length; i++) {
      Section.create({name: result[i].name});

      asynFunc.push(processPodcast.bind(null, {section: result[i], recursive: argv.recursive ? true : false, progress: function(section, results) {
          Podcast.create(results, function(err, podcasts) {

            if (!podcasts) return;

            Section.findOneAndUpdate({name: section.name}, { $push: {"podcasts": {$each: podcasts} } }, function(err, docs) {

              if (err) console.error(err);

              console.log("Succesfully inserted %d elements in %s.".info, podcasts.length, section.name);

            })

          })
      }}));
    }

    async.parallelLimit(asynFunc, 5, function() {
      setTimeout(function() {
        console.log("Disconnecting database %s".debug, mongoDbUrl);
        db.disconnect()
      }, 3000);
    })
  });
