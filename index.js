const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser')
const { Client } = require('pg');
const cors = require('cors');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();
const corsOptions = {
  origin: 'http://7chudes.kharkov.ua',
  optionsSuccessStatus: 200
}

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/clients', cors(corsOptions), (request, response) => {
  client.query('SELECT * FROM users;', (err, res) => {
    if (err) throw err;
    let result = [];
    for (let row of res.rows) {
      result.push(row);
    }
    // response.send(result)
    response.render('pages/db', {
      results: result, checkCourse: data => {
        let courses = [
          { id: 1, text: "Курс \"Рисунок и живопись\" (для взрослых)" },
          { id: 2, text: "Курс \"Рисунок и живопись\" (для детей)" },
          { id: 3, text: "Курс \"Живопись маслом\"" },
          { id: 4, text: "Курс \"Портретная живопись\"" },
          { id: 5, text: "Курс \"Академический рисунок и живопись\" (подготовка к поступлению)" },
          { id: 6, text: "Курс \"Акварель\"" },
          { id: 7, text: "Курс \"Керамическая флористика\"" },
          { id: 8, text: "Курс \"Петриковская роспись\"" },
          { id: 9, text: "Мастер-класс \"Живопись маслом, акрилом\"" },
          { id: 10, text: "Мастер-класс \"Акварель\"" },
          { id: 11, text: "Мастер-класс \"Батик\" (роспись по шелку)" },
          { id: 12, text: "Мастер-класс \"Живопись пастелью\"" },
          { id: 13, text: "Мастер-класс \"Роспись одежды\"" },
          { id: 14, text: "Мастер-класс \"Витражная роспись\"" }
        ];
        return courses.find(k => k.id == data).text
      }
    })
  });

});
app.get('/', cors(corsOptions), (request, response) =>
  response.render('pages/chudesa')
);

app.post('/post', cors(corsOptions), urlencodedParser, (req, response) => {
  client.query(`INSERT INTO users VALUES(
                  '${req.body.name}',
                  '${req.body.phone}',
                  '${req.body.course}',
                   ${Date.now()},
                  '${req.body.mail}');`, (err, res) => {
      if (err) throw err;


      response.sendStatus(200)
    });

  // console.log(req)

});


app.listen(app.get('port'), () =>
  console.log('Node app is running on port', app.get('port'))
);