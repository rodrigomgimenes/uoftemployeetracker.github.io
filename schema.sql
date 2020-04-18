DROP DATABASE IF EXISTS employeetrackerDB;
CREATE database employeetrackerDB;

USE employeetrackerDB;


CREATE TABLE Department (
-- * id   -  INT PRIMARY KEY
-- * name -  VARCHAR(30) to hold department name
  id   INT         NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Role (
--   * id            -  INT PRIMARY KEY
--   * title         -  VARCHAR(30) to hold role title
--   * salary        -  DECIMAL to hold role salary
--   * department_id -  INT to hold reference to department role belongs to
  id             INT           NOT NULL AUTO_INCREMENT,
  title          VARCHAR(30)   NOT NULL,
  salary         DECIMAL(10,2) NOT NULL,
  department_id  INT           NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES Department(id)
);

CREATE TABLE Employee (
--   * id         -  INT PRIMARY KEY
--   * first_name -  VARCHAR(30) to hold employee first name
--   * last_name  -  VARCHAR(30) to hold employee last name
--   * role_id    -  INT to hold reference to role employee has
--   * manager_id -  INT to hold reference to another employee that manager of the current employee. 
--                   This field may be null if the employee has no manager
  id              INT         NOT NULL AUTO_INCREMENT,
  first_name      VARCHAR(30) NOT NULL,
  last_name       VARCHAR(30) NOT NULL,
  role_id         INT         NOT NULL,
  manager_id      INT         NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id)    REFERENCES Role(id),
  CONSTRAINT  FK_ManagerEmployee FOREIGN KEY (manager_id) REFERENCES Employee(id)
);
