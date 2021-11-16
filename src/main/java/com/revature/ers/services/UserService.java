package com.revature.ers.services;

import com.revature.ers.models.User;
import com.revature.ers.repository.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.List;
import java.util.Optional;

@Service("userService")
public class UserService {
    private UserDao userDao;
    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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
        if(!temp.isPresent()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            return this.userDao.save(user);
        }
        return null;
    }

    public User editUser(User sessionUser, User inputUser){
        //Gets the user from Database
        User dataBaseUser = this.userDao.findById(sessionUser.getUserId()).orElse(null);
        //Checks to see if a result was returned
        if(dataBaseUser != null){
            try {
                //Check if the user password is equal to database user password.
                //If not equal then reset to a new password.
                //No session required for this condition as this is from forgot-password
                if (!passwordEncoder.matches(inputUser.getPassword(), dataBaseUser.getPassword()))
                    dataBaseUser.setPassword((passwordEncoder.encode(inputUser.getPassword())));

            } catch (Exception ex){
                dataBaseUser.setFirstName(inputUser.getFirstName());
                dataBaseUser.setLastName(inputUser.getLastName());
            }
            return this.userDao.save(dataBaseUser);
        }
        return null;
    }

    public User getUserByUsername(String username){
        return this.userDao.findUserByUsername(username).orElse(null);
    }

    public User getUserByEmail(String email) {
        return this.userDao.findUserByEmail(email).orElse(null);
    }


}
