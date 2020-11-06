const express = require('express')
const app = express()
const fs = require('fs')
const pdf = require('html-pdf')
const ejs = require('ejs')

app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

const fixtureData = require('./fixture_data.json');
const barChartHelper = require('./bar_chart_helper');
app.locals.barChartHelper = barChartHelper;

app.get('/', function(req, res) {
  res.render('index', { fixtureData: fixtureData });
});

app.get('/download.pdf', function(req, res) {
  res.contentType('application/pdf');

  const html = fs.readFileSync('./index.html', 'utf8');
  const options = { format: 'Letter' };
  const renderedHtml = ejs.render(html, { barChartHelper: barChartHelper, fixtureData: fixtureData })
  
  pdf.create(renderedHtml, options).toFile('./report.pdf', function(err, response) {
    if (err) return console.log(err);
    const data = fs.readFileSync('./report.pdf');
    res.send(data);
  });

  pdf.create(renderedHtml, options).toBuffer(function(err, buffer){
    if (err) return console.log(err);
    res.send(buffer);
  });
})

app.listen(3000);
console.log('listening on port 3000');
