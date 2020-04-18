class Update {
  queryUpdateEmployeeRole() { return `UPDATE employeetrackerDB.Employee 
                                      SET role_id = ? 
                                      WHERE id = ?` }
}

module.exports = Update;