#! user/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");

const config = {
  boolean: ["help", "delete"],
  string: ["name", "number"]
};
const args = require("minimist")(process.argv.slice(2), config);

if (args.help) help();

if (!fileExists("phonebook.json")) {
  fs.writeFileSync("phonebook.json", []);
}
const file = readFile("phonebook.json");
let contacts = parseFile(file);

if (args.delete) {
  const lastName = args.name.split(" ")[1];
  contacts = contacts.filter(contact => contact.name.last !== lastName);
  writeFile("phonebook.json", JSON.stringify(contacts, null, 2));
}

if (args.name && args.num) {
  const contact = new Contact(args);
  contacts.push(contact);
  writeFile("phonebook.json", JSON.stringify(contacts, null, 2));
}

print(contacts.sort(sortByLastName));
/*
 ** functions
 */
function help() {
  console.log("phonebook usage:");
  console.log("phonebook.js                           print contacts");
  console.log('--name="John Doe" --num=0800-555-262   insert contact');
  console.log('--delete --name="John Doe"             delete contact');
  console.log("--help                                 print help");
}

function readFile(file) {
  return fs.readFileSync(path.resolve(__dirname, file));
}
function writeFile(file, data) {
  fs.writeFileSync(path.resolve(__dirname, file), data);
}
function parseFile(file) {
  return JSON.parse(file.toString());
}
function fileExists(file) {
  return fs.existsSync(path.resolve(__dirname, file));
}

function print(contacts) {
  if (contacts.length === 0) console.log("No contacts!");

  let delimiter; // A,B,C... X,Y,Z
  contacts.forEach(contact => {
    const {
      name: { first, last },
      number
    } = contact;
    /*
     ** A
     ** Tom A 0800-555-222
     ** John A 0800-221-777
     ** B
     ** ...
     ** Z
     ** Gen Z 0800-123-456
     */
    if (last[0] !== delimiter) {
      delimiter = last[0];
      console.log(delimiter);
    }
    // John Doe 0800-555-666
    console.log(first + " " + last, number);
  });
}
// Using constructor function syntax instead of
// ES6 Class syntax to access before initialization
function Contact(args) {
  this.name = {
    first: args.name.split(" ")[0],
    last: args.name.split(" ")[1]
  };
  this.number = args.num;
}

function sortByLastName(a, b) {
  return a.name.last < b.name.last ? -1 : 1;
}
