const User = require('../models/user');

module.exports = {
  index: usersIndex,
  show: usersShow,
  update: usersUpdate,
  delete: usersDelete
};

function usersIndex(req, res){
  User.find({},(err,users) =>{
    let status, json;
    if (err){
      status =500;
      json = {message: 'Something went wrong.'};
    }else{
      status =200;
      json = {users};
    }
    return  res.status(status).json(json);
  });
}


function usersShow(req, res){
  User.findById(req.params.id, (err,user) =>{
    let status, json;
    if (err){
      status =500;
      json = {message: 'Something went wrong.'};
    }else{
      if (!user){
        status =404;
        json = {message: 'User not found.'};
      }else{
        status =200;
        json = {user};
      }
    }
    return  res.status(status).json(json);
  });
}

function usersUpdate(req, res){
  User.findbyIdandUpdate(req.params.id, req.body.user, {new: true},(err,user)=>{
    let status, json;
    if (err){
      status =500;
      json = {message: 'Something went wrong.'};
    }else{
      if (!user){
        status =404;
        json = {message: 'User not found.'};
      }else{
        status =200;
        json = {user};
      }
    }
    return  res.status(status).json(json);
  });
}

function usersDelete(req, res){
  User.findByIdAndRemove(req.params.id,(err,user) =>{
    let status, json;
    if (err){
      status =500;
      json = {message: 'Something went wrong.'};
    }else{
      if (!user){
        status =404;
        json = {message: 'User not found.'};
      }else{
        status =204;
        json = {user};
        return res.status(status).send();
      }
    }
    return res.status(status).json(json);
  });
}
