package com.revature.ers.services;

import com.revature.ers.models.User;
import com.revature.ers.models.UserRole;
import com.revature.ers.repository.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("userService")
public class UserService {
    private UserDao userDao;

    @Autowired
    public UserService (UserDao userDao){
        this.userDao = userDao;
    }

    public List<User> getAllUsers(){
        return this.userDao.findAll();
    }

    public User getUserById(Integer userId){
        return this.userDao.findById(userId).orElse(null);
    }

    public User createUser(User user){
        Optional<User> temp = this.userDao.findUserByUsername(user.getUserName());
        if(!temp.isPresent())
            return this.userDao.save(user);
        return null;
    }

    public User editUser(User user){
        return this.userDao.save(user);
    }

    public User getUserByUsername(String username){
        return this.userDao.findUserByUsername(username).orElse(null);
    }

    public User getUserByEmail(String email) {
        return this.userDao.findUserByEmail(email).orElse(null);
    }
}
