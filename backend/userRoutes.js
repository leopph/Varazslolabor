const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userModel = mongoose.model('user');
const passport = require('passport');


router.route('/register').post((req, res) => {
  if (!req.body.username) {
    return res.status(400).send('Registration error: a username is required.');
  }

  if (!req.body.email) {
    return res.status(400).send('Registration error: an e-mail address is required.')
  }

  if (!req.body.password) {
    return res.status(400).send('Registration error: a password is required.');
  }

  userModel.findOne({ username: req.body.username }).then(user => {
    if (user) {
      return res.status(400).send('Registration error: the username is already taken.');
    }

    userModel.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).send('Registration error: the e-mail address is already taken.');
      }

      const newUser = new userModel({ username: req.body.username, email: req.body.email, password: req.body.password, isAdmin: false });
      newUser.save().then(() => {
        return res.status(200).send('Registration was successful.');
      }, error => {
        return res.status(500).send('Registration error: failed to save user data. ' + error);
      });
    }, error => {
      return res.status(500).send('Registration error: failed to check database for e-mail address matches. ' + error);
    });
  }, error => {
    return res.status(500).send('Registration error: failed to check database for username matches. ' + error);
  });
});


router.route('/login').post((req, res) => {
  if (req.isAuthenticated()) {
    return res.status(400).send('Login error: a user is already logged in.');
  }

  if (!req.body.username) {
    return res.status(400).send('Login error: a username is required.');
  }

  if (!req.body.password) {
    return res.status(400).send('Login error: a password is required.');
  }

  passport.authenticate('local', (error, user) => {
    if (error) {
      return res.status(500).send('Login error: failed to authenticate user. ' + error);
    }

    req.login(user, (error) => {
      if (error) {
        return res.status(500).send('Login error: failed to log user in. ' + error);
      }

      return res.status(200).send('Login was successful.');
    });
  })(req, res);
});


router.route('/logout').post((req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(400).send('Logout error: no currently logged in user.');
  }

  req.logout((error) => {
    if (error) {
      return res.status(500).send('Logout error: failed to log user out. ' + error);
    }

    return res.status(200).send('Logout was successful.');
  });
});


router.route('/status').get((req, res) => {
  return res.status(200).json(req.isAuthenticated());
});


router.get('/:username', (req, res) => {
  userModel.findOne({ username: req.params.username }).then(user => {
    if (!user) {
      return res.status(400).send('User does not exist.');
    }

    res.status(200).json(user);
  }, error => {
    res.status(500).send('Failed to query database for user.', error);
  })
});


router.patch('/:username', async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.params.username });

    if (!user) {
      return res.status(400).send('Failed to update user: user does not exist.');
    }

    if (req.body.username != null) {
      user.username = req.body.username;
    }

    if (req.body.password != null) {
      user.password = req.body.password;
    }

    if (req.body.email != null) {
      user.email = req.body.email;
    }

    if (req.body.isAdmin != null) {
      user.isAdmin = req.body.isAdmin;
    }

    await user.save();
    return res.status(200).send('User was successfully updated.');
  } catch (error) {
    return res.status(500).send('Failed to update user. ' + error);
  }
});


router.delete('/:username', async (req, res) => {
  try {
    await userModel.deleteOne({username: req.params.username});
    res.status(200).send('User successfully deleted.');
  } catch (error) {
    return res.status(500).send('Failed to delete user. ' + error);
  }
});

module.exports = router;
