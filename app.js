// ===================
// BASIC SET UP
// ===================
const express = require("express");
let app = express();

// =====================
// FILE ROUTING
// =====================
app.set("views", __dirname + "/views");

// =====================
// FAVICON
// =====================
let favicon = require("serve-favicon");
app.use(favicon(__dirname + "/resources/static/img/favicon-32x32.png"));

// ==============================
// for parsing application/json
// ==============================
app.use(express.json()); 

// ================================================
// for parsing application/x-www-form-urlencoded
// ================================================
app.use(
    express.urlencoded({
        extended: true,
    })
); 

// ===================
// MONGO DB FUNCTIONS
// ===================
const {
    mongoRead,
    mongoWriteGeneral,
    mongoWriteLabor,
    mongoWriteSales,
    mongoUpdateTask,
    mongoDeleteTask
} = require("./app/util/mongoFunctions");


// ===================
// CORS
// ===================
let cors = require("cors");
app.use(cors());

// ===================
// RENDERS PAGE
// ===================
app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

// ===================
// LOGIN TOKEN
// ===================
app.use("/login", (req, res) => {
    res.send({
        token: "qwerty123456",
    });
});

// ===================
// READ TASK API
// ===================
app.get("/readTask", (req, res) => {
    mongoRead("msg", {})
        .then((result) => {
            let title = [];
            let body = [];
            let collectionID = [];
            let statuses = [];
            let i;
            for (i = 0; i < result.length; i++) {
                title.push(result[i].title);
                body.push(result[i].msg);
                collectionID.push(result[i].ID);
                statuses.push(result[i].status);
            }
            res.json({
                title: title,
                msg: body,
                idCollection: collectionID,
                status: statuses,
                length: i,
            });
        })
        .catch((err) => console.log(err));
});

// =====================
// READ SALES DATA API
// =====================
app.get("/readSalesData", (req, res) => {
    mongoRead("sales_demo", {})
        .then((result) => {
            let category = [];
            let gross = [];
            let net = [];
            let division = [];
            let year = [];
            let month = [];
            let store = [];

            for (let i = 0; i < result.length; i++) {
                category.push(result[i].category);
                gross.push(result[i].gross);
                net.push(result[i].net);
                division.push(result[i].dept);
                year.push(result[i].year);
                month.push(result[i].month);
                store.push(result[i].shop);
            }
            res.json({
                category: category,
                gross: gross,
                net: net,
                division: division,
                year: year,
                month: month,
                store: store,
            });
        })
        .catch((err) => console.log(err));
});

// =======================================
// READ LABOR AND SALES DATA TOGETHER API
// =======================================
let result1;
let result2;

app.get("/readLaborAndSales", (req, res) => {
    mongoRead("labor_demo", {})
        .then((result) => {
            result1 = result;
            mongoRead("sales_demo", {})
                .then((result) => {
                    result2 = result;
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err))
        .then(
            res.json({
                result1: result1,
                result2: result2,
            })
        );
});

// ==========================
// WRITE TO DB LABOR COST API
// ==========================
app.post("/writeLaborCost", (req, res) => {
    mongoWriteLabor("labor_demo", req.body)
        .then(
            res.json({
                msg: "success"
            })
        )
        .catch(
            res.json({
                msg: "Doc error. Not inserted!"
            })
        );
});

// ======================
// UPLOAD SALES DATA API
// ======================
app.post("/writeMonthlySalesData", (req, res) => {


    mongoWriteSales("sales_demo", req.body)
        .then(
            res.json({
                msg: "success"
            })
        )
        .catch(
            res.json({
                msg: "Doc error. Not inserted!"
            })
        );
});

// ===================
// ADD TASK API
// ===================
app.post("/writeTask", (req, res) => {
    let tempObj = {
        title: req.body.msgSubject,
        msg: req.body.msgBody,
        ID: req.body.largestID,
        status: req.body.status
    };
    mongoWriteGeneral("msg", tempObj)
        .then(
            res.json({
                msg: "success"
            })
        )
        .catch(
            res.json({
                msg: "Doc error. Not inserted!"
            })
        );
});

// ===================
// UPDATE TASK API
// ===================
app.put("/updateTask", (req, res) => {
    let myquery = {
        ID: parseInt(req.body.selectedID),
    };
    let newvalues = {
        $set: {
            status: req.body.newStatus,
        },
    };
    mongoUpdateTask("msg", myquery, newvalues)
        .then(
            res.json({
                msg: "success"
            })
        )
        .catch(
            res.json({
                msg: "Doc error. Not inserted!"
            })
        );
});

// ===================
// DELETE TASK API
// ===================
app.delete("/deleteTask", (req, res) => {
    let taskQuery = {
        ID: parseInt(req.body.selectedID),
    };
    mongoDeleteTask("msg", taskQuery)
        .then(
            res.json({
                msg: "success"
            })
        )
        .catch(
            res.json({
                msg: "Doc error. Not inserted!"
            })
        );
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});