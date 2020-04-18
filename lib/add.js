class Add {
  queryAddDepartment () { return `INSERT INTO employeetrackerDB.Department (name) 
                                  VALUES ?`
                        }

  queryAddNewRole ()    { return `INSERT INTO employeetrackerDB.Role (title, salary, department_id) 
                                  VALUES (?, ?, ?)`
                        }

  queryAddNewEmployee (id) { 
    if (parseInt(id) === 0) {
      return `INSERT INTO employeetrackerDB.Employee (first_name, last_name, role_id)
              VALUES (?,?,?)`
    }
    else {
      return `INSERT INTO employeetrackerDB.Employee (first_name, last_name, role_id, manager_id)
              VALUES (?,?,?,?)`
    }
  }
}

module.exports = Add;