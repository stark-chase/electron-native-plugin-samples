const greetingModule = require("./greeting-module");

const header = document.querySelector("h1");
header.innerText = greetingModule.greeting();
