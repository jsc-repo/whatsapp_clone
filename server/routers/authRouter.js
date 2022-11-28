const express = require("express");
const Yup = require("yup");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  validateForm(req, res);

  const potentialLogin = await pool.query(
    "SELECT id, username, passhash FROM users u WHERE u.username=$1",
    [req.body.username]
  );

  // if user found
  if (potentialLogin.rowCount > 0) {
    // check if pw is valid
    const isSamePassword = await bcrypt.compare(
      req.body.password,
      potentialLogin.rows[0].hashedpass
    );

    if (isSamePassword) {
      // valid login
      req.session.user = {
        username: req.body.username,
        id: newUserQuery.rows[0].id,
      };
      res.json({
        loggedIn: true,
        username: req.body.username,
      });
    } else {
      // invalid login
      res.json({
        loggedIn: false,
        status: "Wrong username or password",
      });
    }
  } else {
    // user not found
    console.log("User not found");
    res.json({
      loggedIn: false,
      status: "Wrong username or password",
    });
  }
});

router.post("/register", async (req, res) => {
  validateForm(req, res);

  const existingUser = await pool.query(
    "SELECT username FROM users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    // register
    const hashedpass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(username, passhash) VALUES($1, $2) RETURNING id, username",
      [req.body.username, hashedpass]
    );

    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
    };

    res.json({
      loggedIn: true,
      username: req.body.username,
    });
  } else {
    res.json({
      loggedIn: false,
      status: "Username taken",
    });
  }
});

module.exports = router;
