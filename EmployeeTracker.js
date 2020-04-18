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
  console.log("\n[WARNING] Closing connection with database..\n");
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
      // Bonus:

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
      console.log("\n[WARNING] Function not found!\n");
      break;
  }
}

// ADD
function addFunctions(optionFunc) {
  const add = new Add();

  let questionADD_Role = [
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
  
  let questionADD_Employee = [
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
            console.log("\nInsertion failed: " + err.stack + "\n");
            throw err;
          } 

          if (res.affectedRows > 0)
            console.log("\n[*] NEW Department added successfully!\n");
            
          init();
        });
      });
      break;

    case 4: // option = Add new Role
      verifyDepartments(add, true, questionADD_Role); // The boolean variable will indicate if it is an addition function
      break;
 
    case 5: // option = Add new Employee
      verifyRoles(add, true, questionADD_Employee); // The boolean variable will indicate if it is an addition function
      break;
  
    default:
      console.log("\n[WARNING] Function not found!\n");
      break;
  }
}

// UPDATE
function updateFunctions(optionFunc) {
  const update            = new Update();
  let questionUP_Employee = [];

  switch (optionFunc) {
    case 6: // option = Update Employee Role
      verifyRoles(update, false, questionUP_Employee); // The boolean variable will indicate if it is an addition function
      break;
  
    default:
      console.log("\n[WARNING] Function not found!\n");
      break;
  }
}

// Specific Functions:
function verifyDepartments(typeFunc, addFunc, questionADD_Role) {
  const view = new View();

  // GETTING all departments
  db.query(view.queryAllDepartments(), function(err, res) {
    if ((err) || (res.length <= 0)) {
      console.log("\n[WARNING] You MUST add a Department first!\n");
      init();
    }
    else {
      let depNames = [];
      res.forEach(element => {
        depNames.push({ id: element.id, name: element.name});
      });

      // Verify if it is an addition function AND Put ALL departments as options to the user
      if (addFunc) {
        questionADD_Role.push( 
          {
            type:    "list",
            name:    "deplist",
            message: 'Please, choose 1 (one) Department to this Role:',
            choices: depNames.map(key => key.name)
          }
        );

        setRole(typeFunc, addFunc, questionADD_Role, depNames.map(key => key.id));
      }
    }
  });
}

function verifyRoles(typeFunc, addFunc, questionArray) {
  const view = new View();

  // GETTING all roles
  db.query(view.queryAllRolesShort(), function(err, res) {
    if ((err) || (res.length <= 0)) {
      console.log("\n[WARNING] You MUST add a Role first!\n");
      init();
    }
    else {
      let roleTitles = [];
      res.forEach(element => {
        roleTitles.push({ id: element.id, title: element.title});
      });

      // Put ALL roles as options to the user
      questionArray.push( 
        {
          type:    "list",
          name:    "rolelist",
          message: 'Please, select 1 (one) Role Title to your employee:',
          choices: roleTitles.map(key => key.title)
        }
      );

      verifyEmployees(typeFunc, addFunc, questionArray, roleTitles.map(key => key.id));
    }
  });
}

function verifyEmployees (typeFunc, addFunc, questionArray, rolesID) {
  const view = new View();
  let strMsg = "";

  // GETTING all employees
  db.query(view.queryAllEmpShort(), function(err, res) {
    if (err) {
      console.log("\n[ERROR] Service unavailable. Try it later.\n");
      init();
    }
    else {
      let empNames = [];
      res.forEach(element => {
        empNames.push({ id: element.id, name: element.employee_name});
      });

      if (addFunc) {
        // Addition Function
        empNames.push({ id: 0, name: "NONE"});
        strMsg = "Please, select 1 (one) or None Manager to your employee:";
      }
      else {
        // Other Function (in this case: Update Function)
        strMsg = "Please, select 1 (one) employee:";
      }
      

      // Put ALL employees as options to the user
      questionArray.push( 
        {
          type:    "list",
          name:    "emplist",
          message: strMsg,
          choices: empNames.map(key => key.name)
        }
      );

      setEmployee(typeFunc, addFunc, questionArray, rolesID, empNames.map(key => key.id));
    }
  }); 
}

function setRole (typeFunc, addFunc, questionADD_Role, depID) {
  inquirer.prompt(questionADD_Role).then((response) => {
    // ADDING NEW ROLE
    const newTitle  = [[ response.newTitle ]]; 
    const newSalary = [[ parseInt(response.newSalary) ]];
    const newDepID  = [[ depID[questionADD_Role[questionADD_Role.length - 1].choices.indexOf(response.deplist)] ]];

    db.query(typeFunc.queryAddNewRole(), [newTitle, newSalary, newDepID], function(err, res) {
      if (err) {
        console.log("\nInsertion failed: " + err.stack + "\n");
        throw err;
      }

      if (res.affectedRows > 0)
        console.log("\n[*] NEW Role added successfully!\n");
        
      init();
    });
  });
}

function setEmployee (typeFunc, addFunc, questionArray, rolesID, empsID) {
  inquirer.prompt(questionArray).then((response) => {
    if (addFunc) {
      // ADDING NEW EMPLOYEE
      const newFirstName = [[ response.newFirstName ]]; 
      const newLastName  = [[ response.newLastName  ]];
      const newRoleID    = [[ rolesID[questionArray[questionArray.length - 2].choices.indexOf(response.rolelist)] ]];
      const newManagerID = [[ empsID [questionArray[questionArray.length - 1].choices.indexOf(response.emplist)]  ]];

      db.query(typeFunc.queryAddNewEmployee(newManagerID), (parseInt(newManagerID) === 0) ? [newFirstName, newLastName, newRoleID] : [newFirstName, newLastName, newRoleID, newManagerID], function(err, res) {
        verifyResponseQuery(addFunc, err, res);
      });
    }
    else {
      // UPDATING ROLE EMPLOYEE
      const newRoleID     = [[ rolesID[questionArray[questionArray.length - 2].choices.indexOf(response.rolelist)] ]];
      const newEmployeeID = [[ empsID [questionArray[questionArray.length - 1].choices.indexOf(response.emplist)]  ]];

      db.query(typeFunc.queryUpdateEmployeeRole(), [newRoleID, newEmployeeID], function(err, res) {
        verifyResponseQuery(addFunc, err, res);
      });
    }
  });
}

function verifyResponseQuery(addFunc, err, res) {
  if (err) {
    console.log("\n" + ((addFunc) ? "Insertion" : "Update information") + " failed: " + err.stack + "\n");
    throw err;
  }

  if (res.affectedRows > 0)
    console.log("\n[*] NEW Employee " + ((addFunc) ? "added" : "Role updated") + " successfully!\n");
    
  init();
}

// Main function that starts the application
welcome();

