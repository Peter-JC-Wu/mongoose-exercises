const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personSchema = new Schema ({
  hair: { type: String, required: true},
  eyes: { type: String, required: true},
  weight: { type: Number, required: true},
  height: { type: Number, required: true},
  salary: { type: Number, required: true},
  numKids: { type: Number, required: true},
  kids: { type: Array, required: true},
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;