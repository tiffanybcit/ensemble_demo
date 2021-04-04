// ===================
// Basic Set Up
// ===================
const express = require("express");
var app = express();

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

//NODE.js USES THE RESOURCES FOLDER UNDER THE ROOT FOLDER FOR
//ANY FILE SOURCE BY DEFAULT
app.use(express.static("resources"));

var favicon = require("serve-favicon");
var bodyParser = require("body-parser");

app.use(favicon(__dirname + "/resources/static/img/favicon-32x32.png"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// ===================
// MONGO DB
// ===================

const MongoClient = require("mongodb").MongoClient;
const mongoURI =
  "mongodb+srv://admin:qwerty123456@nemesistest.k4jez.mongodb.net/test";

// ===================
// FS AND EJS
// ===================

var fs = require("fs");
const { render } = require("ejs");

// ===================
// CORS
// ===================
var cors = require("cors");
app.use(cors());
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// ===================
// EXPRESS TRIGGER
// ===================

app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

// app.get('/laborSales', function (req, res) {
//     let doc = fs.readFileSync('./views/labor_sales.html', "utf8");

//     res.send(doc);
// });

// app.get('/piegraph', function (req, res) {
//     let doc = fs.readFileSync('./views/PieChart.html', "utf8");

//     res.send(doc);
// });

// app.get('/bargraph', function (req, res) {
//     let doc = fs.readFileSync('./views/BarCharts.html', "utf8");

//     res.send(doc);
// });

// app.get('/success', function (req, res) {
//     let doc = fs.readFileSync('./views/submitted.html', "utf8");

//     res.send(doc);
// });

app.use("/login", (req, res) => {
  res.send({
    username: "test123",
    password: "123456",
  });
});

app.get("/readMsg", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  MongoClient.connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("nemesis_project");
      dbo
        .collection("msg")
        .find({})
        .toArray(function (err, result) {
          let title = [];
          let body = [];

          for (let i = 0; i < result.length; i++) {
            title.push(result[i].title);
            body.push(result[i].msg);
          }
          if (err) throw err;
          res.send({
            title: title,
            msg: body,
          });

          db.close();
        });
    }
  );
});

app.get("/readSalesData", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  MongoClient.connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("nemesis_project");
      dbo
        .collection("sales_demo")
        .find({})
        .toArray(function (err, result) {
          let category = [];
          let gross = [];
          let net = [];
          let division = [];
          let year = [];
          let month = [];
          let store = [];

          for (var i = 0; i < result.length; i++) {
            category.push(result[i].category);
            gross.push(result[i].gross);
            net.push(result[i].net);
            division.push(result[i].dept);
            year.push(result[i].year);
            month.push(result[i].month);
            store.push(result[i].shop);
          }
          if (err) throw err;
          res.send({
            category: category,
            gross: gross,
            net: net,
            division: division,
            year: year,
            month: month,
            store: store,
          });

          db.close();
        });
    }
  );
});

let result1;
let result2;

app.get("/readLaborAndSales", (req, res) => {
  res.setHeader("Content-Type", "text/html");

  MongoClient.connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("nemesis_project");
      dbo
        .collection("labor_demo")
        .find({})
        .toArray(function (err, result) {
          result1 = result;
          if (err) throw err;
          db.close();
        });
    }
  );

  MongoClient.connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("nemesis_project");
      dbo
        .collection("sales_demo")
        .find({})
        .toArray(function (err, result) {
          // console.log(result);
          result2 = result;

          if (err) throw err;

          db.close();
        });
    }
  );

  res.send({
    result1: result1,
    result2: result2,
  });
});

// this api posts data to the database
app.post("/writeLaborCost", (req, res) => {
  console.log("req.body" + JSON.stringify(req.body));

  function getTotal(input) {
    let total = 0;
    total += parseInt(input["Reg. Hourly Pay"]);
    total += parseInt(input["Reg. Salary Pay"]);
    total += parseInt(input["Stat Holiday Pay (Hourly)"]);
    total += parseInt(input["Stat Worked @1.5 (Hourly)"]);
    total += parseInt(input["Vacation Pay Earned (Accrued)"]);
    total += parseInt(input["Vacation Pay Earned (Paid)"]);
    total += parseInt(input["Vacation Pay Taken (Salary)"]);

    return total;
  }
  res.setHeader("Content-Type", "application/json");
  MongoClient.connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("nemesis_project");

      // this option prevents additional documents from being inserted if one fails
      const options = {
        ordered: true,
      };
      for (let item of req.body.rowobj) {
        dbo
          .collection("labor_sales")
          .insertOne(
            {
              total: getTotal(item),
              year: req.body.year,
              month: req.body.month,
              dept: item["Dept Name"],
            },
            options
          )
          .catch((err) => {
            console.error(`Fatal error occurred: ${err}`);
            res.send("Doc error. Not inserted!");
            // break;
          });
      }

      res.send({
        msg: "success",
      });
    }
  );
});

// //update info to the main list
app.post("/writeMonthlySalesData", (req, res) => {
  console.log("req.body" + JSON.stringify(req.body));

  function getDept(input) {
    if (input.localeCompare("Uncategorized") == 0) {
      return "FOH";
    } else if (input.localeCompare("Batch Brew") == 0) {
      return "FOH";
    } else if (input.localeCompare("Dope Coffee") == 0) {
      return "FOH";
    } else if (input.localeCompare("Espresso") == 0) {
      return "FOH";
    } else if (input.localeCompare("Filter") == 0) {
      return "FOH";
    } else if (input.localeCompare("Retail Merchandise") == 0) {
      return "FOH";
    } else if (input.localeCompare("Taps (non-alcoholic)") == 0) {
      return "FOH";
    } else if (input.localeCompare("Tea") == 0) {
      return "FOH";
    } else if (input.localeCompare("Beer ") == 0) {
      return "FOH";
    } else if (input.localeCompare("Cocktails") == 0) {
      return "FOH";
    } else if (input.localeCompare("Food") == 0) {
      return "BOH";
    } else if (input.localeCompare("Pastry") == 0) {
      return "BOH";
    }
    return null;
  }
  res.setHeader("Content-Type", "application/json");
  MongoClient.connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("nemesis_project");

      // this option prevents additional documents from being inserted if one fails
      const options = {
        ordered: true,
      };
      for (let item of req.body.rowobj) {
        dbo
          .collection("sales_demo")
          .insertOne(
            {
              shop: req.body.store,
              year: req.body.year,
              month: req.body.month,
              dept: getDept(item.Category),
              category: item.Category,
              net: item["Net Sales"],
              gross: item["Gross Sales"],
            },
            options
          )
          .catch((err) => {
            console.error(`Fatal error occurred: ${err}`);
            res.send("Doc error. Not inserted!");
          });
      }

      res.send({
        msg: "success",
      });
    }
  );
});

// //update info to the main list
app.post("/writeMsg", (req, res) => {
  console.log("req.body" + JSON.stringify(req.body));

  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");

  MongoClient.connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("nemesis_project");

      // this option prevents additional documents from being inserted if one fails
      const options = {
        ordered: true,
      };

      dbo
        .collection("msg")
        .insertOne(
          {
            title: item.msgSubject,
            msg: item.body.msgBody,
          },
          options
        )
        .catch((err) => {
          console.error(`Fatal error occurred: ${err}`);
          res.send("Doc error. Not inserted!");
        });

      res.send({
        msg: "success",
      });
    }
  );
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
