class View {
  queryAllDepartments ()  { return `SELECT * 
                                    FROM employeetrackerDB.Department;` 
                          }
  queryAllRoles()         { return `SELECT Role.id, title, name 
                                    FROM employeetrackerDB.Role 
                                    INNER JOIN employeetrackerDB.Department 
                                    WHERE (department_id = Department.id) 
                                    ORDER BY Role.id DESC;`
                          }

  // async getAllDepartments() {
  //   // GETTING all departments
  //   db.query(this.queryAllDepartments(),function(err, res) {
  //     if (err) throw err;

  //     if (res.length > 0) {
  //       console.log("\nID   Department\n---  ------------");

  //       res.forEach(element => {
  //         let str = (element.id).toString();
  //         console.log(str.padEnd(5, ' ') + element.name);
  //       });

  //       console.log("---  ------------\n");
  //     }
  //   });  
  // }
  getAllDepartments(err, res) {
    if (err) throw err;

    if (res.length > 0) {
      console.log("\nID   Department\n---  ------------");

      res.forEach(element => {
        let str = (element.id).toString();
        console.log(str.padEnd(5, ' ') + element.name);
      });

      console.log("---  ------------\n");
    }
  }

  getAllRoles(err, res, MAX_STRING_TAM) {
    if (err) throw err;

    if (res.length > 0) {
      console.log("\nID   Role                            Department\n---  ------------------------------  ------------------------------");

      res.forEach(element => {
        let str1 = (element.id).toString();
        let str2 = element.title;
        let str3 = element.name;
        console.log(str1.padEnd(5, ' ') + str2.padEnd(MAX_STRING_TAM, ' ') + str3.padEnd(MAX_STRING_TAM, ' '));
      });

      console.log("---  ------------------------------  ------------------------------\n");
    }
  }
}

module.exports = View;