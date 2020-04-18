const inquirer = require('inquirer');
const db       = require('./db');
const View     = require("./lib/view");
const Add      = require("./lib/add");
const Update   = require("./lib/update");

const MAX_STRING_TAM  = 30+2;
const MAX_DECIMAL_TAM = 13+2;

const question = [
  // General Questions:
  {
    type:    "list",
    name:    "option",
    message: "Please, select one of the options below:",
    choices: [
      "01. View ALL Departments",
      "02. View ALL Roles",
      "03. View ALL Employees",
      "04. Add new Department",
      "05. Add new Role",
      "06. Add new Employee",
      "07. Update Employee Role",
      /*
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

const questionADD_Role = [
  // Insertion Questions:
  {
    type:    "input",
    name:    "newTitle",
    message: "Insert new Role Title: "
  },
  {
    type:    "input",
    name:    "newSalary",
    message: "Insert new Role Salary: "
  }
];

const questionADD_Employee = [
  // Insertion Questions:
  {
    type:    "input",
    name:    "newFirstName",
    message: "Insert new Employee First Name: "
  },
  {
    type:    "input",
    name:    "newLastName",
    message: "Insert new Employee Last Name: "
  }
];

function welcome() {
  inquirer.prompt(
    [
      {
        type:    "list",
        name:    "welcomeOption",
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

function closeConnection(){
  console.log("[WARNING] Closing connection with database..");
  db.end();
}

function init() {
  inquirer.prompt(question).then( (response) => {
    // Verify the chosen option
    switch (parseInt(question[0].choices.indexOf(response.option))) {
      case 0:
      case 1:
      case 2:
        viewFunctions(parseInt(question[0].choices.indexOf(response.option)));
        break;
     
      case 3:
      case 4:
      case 5:
        addFunctions(parseInt(question[0].choices.indexOf(response.option)));
        break;
     
      case 6:
        updateFunctions(parseInt(question[0].choices.indexOf(response.option)));
        break;
/*       
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

// VIEW
function viewFunctions(optionFunc) {
  const view = new View();
  switch (optionFunc) {
    case 0: // option = View ALL Departments
      // GETTING all departments
      db.query(view.queryAllDepartments(), function(err, res) {
        view.getAllDepartments(err, res);
        init();
      });
      break;

    case 1: // option = View ALL Roles
      // GETTING all roles
      db.query(view.queryAllRoles(), function(err, res) {
        view.getAllRoles(err, res, MAX_STRING_TAM);
        init();
      }); 
      break;
 
    case 2: // option = View ALL Employees
      // GETTING all employees
      db.query(view.queryAllEmployees(), function(err, res) {
        view.getAllEmployees(err, res, MAX_STRING_TAM, MAX_DECIMAL_TAM);
        init();
      }); 
      break;
  
    default:
      console.log("[WARNING] Function not found!");
      break;
  }
}

// ADD
function addFunctions(optionFunc) {
  const add = new Add();
  switch (optionFunc) {
    case 3: // option = Add new Department
      inquirer.prompt(
      [
        {
          type:    "input",
          name:    "newDepartment",
          message: "Insert new Department: "
        }
      ]).then((response) => {
        // ADDING NEW DEPARTMENT
        const newDepartment = [[response.newDepartment]];
        db.query(add.queryAddDepartment(), [newDepartment], function(err, res) {
          if (err) {
            console.log('Insertion failed: ' + err.stack);
            throw err;
          } 

          if (res.affectedRows > 0)
            console.log("\n[*] NEW Department added successfully!\n");
            
          init();
        });
      });
      break;

    case 4: // option = Add new Role
      verifyDepartments(add); 
      break;
 
    case 5: // option = Add new Employee
      verifyRoles(add);
      break;
  
    default:
      console.log("[WARNING] Function not found!");
      break;
  }
}

// UPDATE
function updateFunctions(optionFunc) {
  const update = new Update();
  switch (optionFunc) {
    case 6: // option = Update Employee Role
      // UPDATING information about Employee's Role
      db.query(view.queryUpdateEmployeeRole(), function(err, res) {
        if (err) {
          console.log('Update information failed: ' + err.stack);
          throw err;
        } 

        if (res.affectedRows > 0)
          console.log("\n[*] NEW Role updated successfully!\n");

        init();
      });
      break;
  
    default:
      console.log("[WARNING] Function not found!");
      break;
  }
}

// Specific Functions:

function verifyDepartments(add) {
  const view = new View();
  // GETTING all departments
  db.query(view.queryAllDepartments(), function(err, res) {
    if ((err) || (res.length <= 0)) {
      console.log(`WARNING: You MUST add a Department first.`);
      init();
    }
    else {
      let depNames = [];
      res.forEach(element => {
        depNames.push({ id: element.id, name: element.name});
      });

      // Put ALL repositories as options to the user
      questionADD_Role.push( 
        {
          type:    "list",
          name:    "deplist",
          message: 'Please, choose 1 (one) Department to this Role:',
          choices: depNames.map(key => key.name)
        }
      );

      addNewRole(add, depNames.map(key => key.id));
    }
  });
}

function addNewRole (add, depID) {
  inquirer.prompt(questionADD_Role).then((response) => {
    // ADDING NEW ROLE
    const newTitle  = [[ response.newTitle ]]; 
    const newSalary = [[ parseInt(response.newSalary) ]];
    const newDepID  = [[ depID[questionADD_Role[questionADD_Role.length - 1].choices.indexOf(response.deplist)] ]];

    db.query(add.queryAddNewRole(), [newTitle, newSalary, newDepID], function(err, res) {
      if (err) {
        console.log('Insertion failed: ' + err.stack);
        throw err;
      }

      if (res.affectedRows > 0)
        console.log("\n[*] NEW Role added successfully!\n");
        
      init();
    });
  });
}

function verifyRoles(add) {
  const view = new View();
  // GETTING all roles
  db.query(view.queryAllRolesShort(), function(err, res) {
    if ((err) || (res.length <= 0)) {
      console.log(`WARNING: You MUST add a Role first.`);
      init();
    }
    else {
      let roleTitles = [];
      res.forEach(element => {
        roleTitles.push({ id: element.id, title: element.title});
      });

      // Put ALL repositories as options to the user
      questionADD_Employee.push( 
        {
          type:    "list",
          name:    "rolelist",
          message: 'Please, choose 1 (one) Role Title to your employee:',
          choices: roleTitles.map(key => key.title)
        }
      );

      verifyEmployees(add, roleTitles.map(key => key.id))
    }
  });
}

function verifyEmployees (add, rolesID) {
  const view = new View();
  // GETTING all employees
  db.query(view.queryAllEmpShort(), function(err, res) {
    if ((err) || (res.length <= 0)) {
      console.log(`WARNING: You MUST add a Role first.`);
      init();
    }
    else {
      let empNames = [];
      res.forEach(element => {
        empNames.push({ id: element.id, name: element.employee_name});
      });
      empNames.push({ id: 0, name: "NONE"});

      // Put ALL repositories as options to the user
      questionADD_Employee.push( 
        {
          type:    "list",
          name:    "emplist",
          message: 'Please, choose 1 (one) or None Manager to your employee:',
          choices: empNames.map(key => key.name)
        }
      );

      addNewEmployee(add, rolesID, empNames.map(key => key.id))
    }
  }); 
}

function addNewEmployee (add, rolesID, empsID) {
  inquirer.prompt(questionADD_Employee).then((response) => {
    // ADDING NEW EMPLOYEE
    const newFirstName = [[ response.newFirstName ]]; 
    const newLastName  = [[ response.newLastName  ]];
    const newRoleID    = [[ rolesID[questionADD_Employee[questionADD_Employee.length - 2].choices.indexOf(response.rolelist)] ]];
    const newManagerID = [[ empsID [questionADD_Employee[questionADD_Employee.length - 1].choices.indexOf(response.emplist)]  ]];


    db.query(add.queryAddNewEmployee(newManagerID), (parseInt(newManagerID) === 0) ? [newFirstName, newLastName, newRoleID] : [newFirstName, newLastName, newRoleID, newManagerID], function(err, res) {
      if (err) {
        console.log('Insertion failed: ' + err.stack);
        throw err;
      }

      if (res.affectedRows > 0)
        console.log("\n[*] NEW Employee added successfully!\n");
        
      init();
    });
  });
}

welcome();

