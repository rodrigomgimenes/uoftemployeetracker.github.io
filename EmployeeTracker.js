const inquirer = require('inquirer');
const db       = require('./db');
const View     = require("./lib/view");

const MAX_STRING_TAM = 30+2;

const question = [
  // General Questions:
  {
    type: 'list',
    name: 'option',
    message: "Please, select one of the options below:",
    choices: [
      "01. View ALL Departments",
      "02. View ALL Roles",
      /*
      "03. View ALL Employees",
      "04. Add new Department",
      "05. Add new Role",
      "06. Add new Employee",
      "07. Update Employee Role",
      // Bonus:
      "08. Delete Departments",
      "09. Delete Roles",
      "10. Delete Employees",
      "11. View Employees by Manager",
      "12. Update Employee Manager",
      "13. View Total Budget of a Department", // ie the combined salaries of all employees in that department
      */
      "EXIT"
    ]
  }
];

function welcome() {
  inquirer.prompt(
    [
      {
        type: 'list',
        name: 'welcomeOption',
        message: "Welcome to Employee Tracker!\n" + 
                 "A command-line application that will help you View, Add, Update and Delete your Employee Information more efficiently.",
        choices: [
          "Start",
          "EXIT"
        ]
      }
    ] 
  ).then( (answer) => {
    // Verify the chosen option
    switch (answer.welcomeOption) {
      case "Start": // Option "Start" (initiate program)
        init();
        break;

      default:
        closeConnection();
        break;
    }
  });
}

function init() {
  inquirer.prompt(question).then( (response) => {
    // Verify the chosen option
    switch (parseInt(question[0].choices.indexOf(response.option))) {
      case 0: // option = View ALL Departments
        viewAllDepartments();
        break;

      case 1: // option = View ALL Roles
        viewAllRoles();
        break;
/* 
      case 2: // option = View ALL Employees
        viewAllEmployees();
        break;
     
      case 3: // option = Add new Department
        ();
        break;

      case 4: // option = Add new Role
        ();
        break;
      
      case 5: // option = Add new Employee
        ();
        break;

      case 6: // option = Update Employee Role
        ();
        break;
      
      case 7: // option = Delete Departments
        ();
        break;

      case 8: // option = Delete Roles
        ();
        break;
      
      case 9: // option = Delete Employees
        ();
        break;

      case 10: // option = View Employees by Manager
        ();
        break;
      
      case 11: // option = Update Employee Manager
        ();
        break;

      case 12: // option = View Total Budget of a Department
        ();
        break;
*/    
      default:
        closeConnection();
        break;
    }
  });
}

function closeConnection(){
  console.log("[WARNING] Closing connection with database..");
  db.end();
}

// let viewAllDepartments = async function() { // Async function expression
//   new View().getAllDepartments() // returns a promise
//     .then(await callInit());
// }

// function callInit() {
//   return new Promise(function(resolve, reject) {
//     setTimeout(function() {
//       resolve(init());
//     }, 350);
//   }); 
// }

function viewAllDepartments() {
  const view = new View();

  // GETTING all departments
  db.query(view.queryAllDepartments(), function(err, res) {
    view.getAllDepartments(err, res);
    init();
  });
}

function viewAllRoles() {
  const view = new View();

  // GETTING all roles
  db.query(view.queryAllRoles(), function(err, res) {
    view.getAllRoles(err, res, MAX_STRING_TAM);
    init();
  });  
}

welcome();

