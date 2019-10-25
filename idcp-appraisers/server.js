var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var QUESTIONS_COLLECTION = "questions";

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  console.log(message);
  res.status(code || 500).json({"error": message});
}

/*  "/api/questions"
 *    GET: finds all questions
 *    POST: creates a new question
 */

app.get("/api/questions", function (req, res) {
  db.collection(QUESTIONS_COLLECTION).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get questions.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/questions", function (req, res) {
  var newQuestion = req.body;
  newQuestion.createDate = new Date();
  db.collection(QUESTIONS_COLLECTION).insertOne(newQuestion, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new question.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });

});

/*  "/api/questions/:id"
 *    GET: find question by id
 *    PUT: update question by id
 *    DELETE: deletes question by id
 */

app.get("/api/questions/:id", function (req, res) {
  db.collection(QUESTIONS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get question");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/api/dcp",async function (req, res) {
  const query = req.query;
  const miles = query.miles;
  const brand = query.brand;
  const model = query.model;
  const year = query.year;
  if (!brand && !model) {
    handleError(res, "Invalid user input", "Must provide a brand and model.", 400);
  }
  var comparator_func = function (operator, val1, val2) {
    switch (operator) {
      case "=":
        return parseInt(val1, 10) === parseInt(val2, 10);
      case "<":
        return parseInt(val2, 10) < parseInt(val1, 10);
      case "<=":
        return parseInt(val2, 10) <= parseInt(val1, 10);
      case ">":
        return parseInt(val2, 10) > parseInt(val1, 10);
      case ">=":
        return parseInt(val2, 10) >= parseInt(val1, 10);
      case "!=":
        return parseInt(val1, 10) !== parseInt(val2, 10);
    }
  };
  var result = await db.collection(QUESTIONS_COLLECTION)
    .find({
      "issue_conditions.brand": brand,
      "issue_conditions.model": model
    }).toArray();
  if (result && Array.isArray(result) && miles) {
    try {
      var questions = result.reduce(function (filtered, i) {
        if (i.question && i.issue_conditions
          && i.issue_conditions.miles && comparator_func(i.issue_conditions.miles.operator, i.issue_conditions.miles.value, miles)
          && i.issue_conditions.year && comparator_func(i.issue_conditions.year.operator, i.issue_conditions.year.value, year)
        ) {
          filtered.push(i.question);
        }
        return filtered;
      }, []);
      res.status(200).json(questions);
    }
    catch (err) {
      handleError(res, err, "Failed to filter questions per mile");
    }
  }
  res.status(200).json(result);
});

app.get("/api/issues",async function (req, res) {
  const query = req.query;
  const miles = query.miles;
  const brand = query.brand;
  const model = query.model;
  const year = query.year;
  const notes = query.notes;
  const questions= query.questions;
  if (!brand && !model) {
    handleError(res, "Invalid user input", "Must provide a brand and model.", 400);
  }
  var comparator_func = function (operator, val1, val2) {
    switch (operator) {
      case "=":
        return parseInt(val1, 10) === parseInt(val2, 10);
      case "<":
        return parseInt(val2, 10) < parseInt(val1, 10);
      case "<=":
        return parseInt(val2, 10) <= parseInt(val1, 10);
      case ">":
        return parseInt(val2, 10) > parseInt(val1, 10);
      case ">=":
        return parseInt(val2, 10) >= parseInt(val1, 10);
      case "!=":
        return parseInt(val1, 10) !== parseInt(val2, 10);
    }
  };
  var result = await db.collection(QUESTIONS_COLLECTION)
    .find({
      "issue_conditions.brand": brand,
      "issue_conditions.model": model
    }).toArray();
  if (result && Array.isArray(result) && miles) {
    try {
      var issues = result.reduce(function (filtered, i) {
        if (i.issue_conditions
          && i.issue_conditions.miles && comparator_func(i.issue_conditions.miles.operator, i.issue_conditions.miles.value, miles)
          && i.issue_conditions.year && comparator_func(i.issue_conditions.year.operator, i.issue_conditions.year.value, year)
        ) {
          if(notes && questions) {
            filtered.push(i);
          }else if(notes && !questions && !i.question){
            filtered.push(i);
          }else if(questions && !notes && i.question){
            filtered.push(i);
          }
        }
        return filtered;
      }, []);
      res.status(200).json(issues);
    }
    catch (err) {
      handleError(res, err, "Failed to filter questions per mile and year");
    }
  }
  res.status(200).json(result);
});

app.put("/api/questions/:id", function (req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(QUESTIONS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update question");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/questions/:id", function (req, res) {
  db.collection(QUESTIONS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function (err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete question");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});
