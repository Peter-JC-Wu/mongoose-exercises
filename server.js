/*=====================================================
Our Setup -
we are going to send requests to another API
so we need a bit more than usual!
=======================================================*/
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

const request = require('request')
const mongoose = require('mongoose')
const Book = require("./models/BookModel")
const Person = require("./models/PersonModel")

mongoose.connect("mongodb://127.0.0.1:27017/mongoose-exercises", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


/*=====================================================
Create books Collection
=======================================================*/
const isbns = [9780156012195, 9780743273565, 9780435905484, 9780140275360, 9780756404741, 9780756407919, 9780140177398, 9780316769488, 9780062225672, 9780143130154, 9780307455925, 9781501143519]

const url = "https://www.googleapis.com/books/v1/volumes?q=isbn:"

const loadFromAPI = (apiURL) => {
  request(apiURL, function(error, response, body) {

    const result = JSON.parse(body)

    if (result.totalItems && !error && response.statusCode == 200) {
      const resBook = JSON.parse(body).items[0].volumeInfo

      const book = new Book({
        title: resBook.title,
        author: resBook.authors ? resBook.authors[0] : null,
        pages: resBook.pageCount,
        genres: resBook.categories || ["Other"],
        rating: resBook.averageRating || 5
      })

      //Only save if the book doesn't exist yet
      Book.findOne({ title: book.title }, function(err, foundBook) {
        if (!foundBook) {
          book.save()
        }
      })
    }
  })
}

isbns.forEach((i) => {
  const apiURL = url + i;
  /*=====================================================
  the first time you run your code, uncomment the function below.
  for subsequent runs, re-comment it so that it runs only once!
  that said, there is a fail-safe to avoid duplicates below
  =======================================================*/
  loadFromAPI(apiURL)
});


/*=====================================================
Create People Collection
=======================================================*/
const colors = ["brown", "black", "red", "yellow", "green", "grey"];

const getColor = () => {
  return colors[Math.floor(Math.random() * colors.length)]
};

const getWeight = () => getRandIntBetween(50, 120)

const getHeight = () => getRandIntBetween(120, 230)

const getSalary = () => getRandIntBetween(20000, 50000)

const getNumKids = () => Math.floor(Math.random() * 3)

const getRandIntBetween = (min, max) => {
  return Math.floor(Math.random() *
    (max - min + 1) + min)
}

const getKids = (numKids) => {
  let kids = [];
  for (let i = 0; i < numKids; i++) {
    kids.push({
      hair: getColor(),
      eyes: getColor(),
      weight: getWeight(),
      height: getHeight(),
    })
  }
  return kids;
}


/*=====================================================
the below code always makes sure
you don't have over 100 people and
adds new people and their kids until you do have 100

try to understand how this code works
could you write it differently?
=======================================================*/
Person.find({}).count((err, count) => {
  // the below two loops could be changed to a simple:
  // for (var i = count; i < 100; i++) {}
  if (count < 100) {
    for (let i = 0; i < 100 - count; i++) {
      let numKids = getNumKids();
      let p = new Person({
        hair: getColor(),
        eyes: getColor(),
        weight: getWeight(),
        height: getHeight(),
        salary: getSalary(),
        numKids: numKids,
        kids: getKids(numKids)
      });
      p.save();
    }
  }
})


/*=====================================================
Start the server:
=======================================================*/

app.listen(3001, () => {
  console.log("Server up and running on port 3001")
});


/*=====================================================
Exercises - now that your databases are full
and your server is running do the following:
=======================================================*/

/*Books
----------------------*/
//1. Find books with fewer than 500 but more than 200 pages

let queryBooksWithPages = Book.find( { pages: { $gte: 200, $lte: 500 } } );

queryBooksWithPages.exec().then(function (books) {
  console.log("Books- question 1 answer is: ==============================================");
  console.log("All the books with fewer than 500 but more than 200 pages...");
  console.log(books);
  console.log("===========================================================================");
});

//2. Find books whose rating is less than 5, and sort by the author's name

let queryBookRatings = Book.find( { rating: { $gte: 1, $lte: 4.9 } } )
  .sort("author")

  queryBookRatings.exec().then(function (books) {
    console.log("Books- question 2 answer is: ==============================================");
    console.log("All the books whose rating is less than 5, and sort by the author's name...");
    console.log(books);
    console.log("===========================================================================");
  });

//3. Find all the Fiction books, skip the first 2, and display only 3 of them

let queryFictionBooks = Book.find( { genres: "Fiction" } )
  .skip(2).limit(3)

  queryFictionBooks.exec().then(function (books) {
    console.log("Books- question 3 answer is: ==============================================");
    console.log("All the Fiction books, skip the first 2, and display only 3 of them...");
    console.log(books);
    console.log("===========================================================================");
  });

/*People
----------------------*/
//1. Find all the people who are tall (>180) AND rich (>30000)

let queryTallAndRichPeople = Person.find( { 
  $and: [ 
    { height: { $gt: 180 } },
    { salary: { $gt: 30000 } }
  ]
} );

queryTallAndRichPeople.exec().then(function(people) {
  console.log("People- question 1 answer is: =============================================");
  console.log("All the people who are tall (>180) AND rich (>30000)...")
  console.log(people);
  console.log("===========================================================================");
});

//2. Find all the people who are tall (>180) OR rich (>30000)

let queryTallOrRichPeople = Person.find( { 
  $or: [ 
    { height: { $gt: 180 } },
    { salary: { $gt: 30000 } }
  ]
} );

queryTallOrRichPeople.exec().then(function(people) {
  console.log("People- question 2 answer is: =============================================");
  console.log("All the people who are tall (>180) OR rich (>30000)...")
  console.log(people);
  console.log("===========================================================================");
});

//3. Find all the people who have grey hair or eyes, and who's weight (<70)

let queryGreyHairOrEyesPeopleAndWeight = Person.find( { 
  $and: [ 
    { $or: [ { hair: "grey" }, { eyes: "grey" } ] },
    { weight: { $lte: 69.99 } }
  ]
} );

queryGreyHairOrEyesPeopleAndWeight.exec().then(function(people) {
  console.log("People- question 3 answer is: =============================================");
  console.log("All the people who have grey hair or eyes, and who's weight (<70)...")
  console.log(people);
  console.log("===========================================================================");
});

//4. Find people who have at least 1 kid with grey hair

let queryPeopleWithAtLeastOneKidAndGreyHair = Person.find( { 
  $and: [ 
    { numKids: { $gte: 1 } },
    { hair: "grey" }
  ]
} );

queryPeopleWithAtLeastOneKidAndGreyHair.exec().then(function(people) {
  console.log("People- question 4 answer is: =============================================");
  console.log("All the people who have at least 1 kid with grey hair...")
  console.log(people);
  console.log("===========================================================================");
});

//5. Find all the people who have at least one kid who's weight is >100 and themselves' weight is >100

let queryPeopleAndKidsWeight = Person.find( { 
  $and: [ 
    { numKids: { $gte: 1 } },
    { kids: { $elemMatch: { weight: { $gt: 100 } } } },
    { weight: { $gt: 100 } }
  ]
} );

queryPeopleAndKidsWeight.exec().then(function(people) {
  console.log("People- question 5 answer is: =============================================");
  console.log("All the people who have at least one kid who's weight is >100 and themselves' weight is >100...")
  console.log(people);
  console.log("===========================================================================");
});