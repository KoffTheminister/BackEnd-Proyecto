
const readline = require('readline');

async function getUserInput(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const userInput = await getUserInput('Please enter a string: ');
  console.log(`You entered: ${userInput}`);

  // You can use userInput here and in other parts of the main function
  // Example:
  //const message = `Your message was: ${userInput}`;
  //console.log(message);
  return(userInput);
}

async function mainsequel(inputazo) {
  console.log('input was successful: ', inputazo);
}

console.log('your mother');
let myvar = main();
mainsequel(myvar);


/*
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter a string: ', (answer) => {
  console.log(`You entered: ${answer}`);
  rl.close();
});
*/