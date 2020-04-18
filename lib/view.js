class View {
  queryAllDepartments ()  { return `SELECT * 
                                    FROM employeetrackerDB.Department;` 
                          }
  queryAllRoles()         { return `SELECT R.id, R.title, R.salary,
                                           D.name 
                                    FROM employeetrackerDB.Role             AS R
                                    INNER JOIN employeetrackerDB.Department AS D 
                                    ON (R.department_id = D.id) 
                                    ORDER BY R.id;`
                          }
  queryAllEmployees ()    { return `SELECT E.id, CONCAT(E.first_name, ' ', E.last_name) AS employee_name, 
                                           R.title, R.salary, 
                                           D.name AS department,
                                           CONCAT(M.first_name, ' ', M.last_name) AS manager_name
                                    FROM (((employeetrackerDB.Employee       AS E
                                    INNER JOIN employeetrackerDB.Role        AS R  ON E.role_id       = R.id)
                                    INNER JOIN employeetrackerDB.Department  AS D  ON R.department_id = D.id)
                                    LEFT  JOIN employeetrackerDB.Employee    AS M  ON E.manager_id    = M.id)
                                    ORDER BY E.role_id;` 
                          }

  queryAllRolesShort()    { return `SELECT R.id, R.title
                                    FROM employeetrackerDB.Role AS R;`
                          }
  queryAllEmpShort()      { return `SELECT E.id, CONCAT(E.first_name, ' ', E.last_name) AS employee_name
                                    FROM employeetrackerDB.Employee AS E;`
                          }

  getAllDepartments(err, res) {
    if (err) throw err;

    if (res.length > 0) {
      console.log("\nID    Department");
      console.log("----  ------------------------------");

      res.forEach(element => {
        const strID = (element.id).toString();
        console.log(strID.padEnd(6, ' ') + element.name);
      });

      console.log("----  ------------------------------\n");
    }
    else
      console.log("\n[ATTENTION] Your database has no Department information available yet.\n");
  }

  getAllRoles(err, res, MAX_STRING_TAM) {
    if (err) throw err;

    if (res.length > 0) {
      console.log("\nID    Role                            Department                      Salary");
      console.log("----  ------------------------------  ------------------------------  -------------");

      res.forEach(element => {
        const strID   = (element.id).toString();
        const strRole = element.title;
        const strDep  = element.name;
        console.log(strID.padEnd(6, ' ') + strRole.padEnd(MAX_STRING_TAM, ' ') + strDep.padEnd(MAX_STRING_TAM, ' ') + element.salary);
      });

      console.log("----  ------------------------------  ------------------------------  -------------\n");
    }
    else
      console.log("\n[ATTENTION] Your database has no Role information available yet.\n");
  }

  getAllEmployees(err, res, MAX_STRING_TAM, MAX_DECIMAL_TAM) {
    if (err) throw err;

    if (res.length > 0) {
      console.log("\nID    Employee (Full Name)            Role                            Department                      Salary         Manager (Full Name)");
      console.log("----  ------------------------------  ------------------------------  ------------------------------  -------------  ------------------------------");
      
      res.forEach(element => {
        const strID     = (element.id).toString();
        const strEName  = element.employee_name;
        const strRole   = element.title;
        const strSalary = (element.salary).toString();
        const strDep    = element.department;
        const strMName  = element.manager_name;
        console.log(
                    strID.padEnd     (6,               ' ') + 
                    strEName.padEnd  (MAX_STRING_TAM,  ' ') + 
                    strRole.padEnd   (MAX_STRING_TAM,  ' ') + 
                    strDep.padEnd    (MAX_STRING_TAM,  ' ') + 
                    strSalary.padEnd (MAX_DECIMAL_TAM, ' ') + 
                    strMName
                   );
      });
      
      console.log("----  ------------------------------  ------------------------------  ------------------------------  -------------  ------------------------------\n");
    }
    else
      console.log("\n[ATTENTION] Your database has no Employee information available yet.\n");
  }
}

module.exports = View;