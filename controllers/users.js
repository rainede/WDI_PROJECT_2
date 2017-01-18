const User = require('../models/user');

module.exports = {
  index: usersIndex,
  show: usersShow,
  update: usersUpdate,
  delete: usersDelete,
  query: usersQuery
};

function usersIndex(req, res) {
  User.find((err, users) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(200).json({ users });
  });
}

function usersQuery(req, res){
// const reqVerified     = req.body.reqVerified;
  const distance = req.body.distance;
  const long = req.body.lang;
  const lat = req.body.long;
  User.find({},(err, users) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return users;
  })
  .where('location').near({ center: {type: 'Point', coordinates: [long, lat]},
    // Converting meters to miles. Specifying spherical geometry (for globe)
    maxDistance: distance * 1609.34, spherical: true})
  .done((err,users)=>{
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(200).json({ users });
  });
}

function usersShow(req, res) {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json({ user });
  });
}

function usersUpdate(req, res) {
  User.count({}, function( err, count){
    if (count === 0){
      //make adminstrator if first record
      req.body.user.admin =true;
    }
  });
  User.findByIdAndUpdate(req.params.id, req.body.user, { new: true },  (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json({ user });
  });
}

function usersDelete(req, res) {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(204).send();
  });
}
