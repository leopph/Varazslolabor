const mongoose = require('mongoose');
const userModel = mongoose.model('user');

function bootstrap() {
  userModel.findOne({isAdmin: true}).then(user => {
    if (!user) {
      const newAdmin = new userModel({
        username: 'admin',
        password: 'admin',
        email: 'admin@admin.admin',
        isAdmin: true
      });

      newAdmin.save().then(() => {
        console.log('Admin user created.');
      }, error => {
        console.log('Failed to create admin user.', error);
      });
    }
  }, error => {
    console.log('Failed to query admin user.', error);
  });
}

module.exports = bootstrap;
