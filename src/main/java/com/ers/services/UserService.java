package com.ers.services;

import com.ers.models.UserRole;
import com.ers.repository.UserDao;
import com.ers.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@Service("userService")
public class UserService {
    private UserDao userDao;
    static BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public UserService (UserDao userDao){
        this.userDao = userDao;
    }

    public User verifyUser(String userName){
        try {
            if (userName.matches("@")) {
                return getUserByEmail(userName);
            } else {
                return getUserByUsername(userName);
            }
        } catch (Exception ex) {
            return null;
        }
    }

    public User getUserById(Integer userId){
        User user =  this.userDao.findById(userId).orElse(null);
        user.setPassword(null);
        return user;
    }

    public User createUser(User user){
        Optional<User> temp = this.userDao.findUserByUsername(user.getUserName());
        if(!temp.isPresent()) {
            // Need to remove the userId from the front-end
            User inputUser = new User();
            inputUser.setUserName(user.getUserName());
            inputUser.setPassword(newPassword(user.getEmail()));
            inputUser.setEmail(user.getEmail());
            inputUser.setFirstName(user.getFirstName());
            inputUser.setLastName(user.getLastName());
            inputUser.setPicUrl(user.getPicUrl());
            for (UserRole role: UserRole.values()){
                if (role == user.getRole()){
                    inputUser.setRole(role);
                }
            }
            System.out.println("IN CREATE USER Service");
            System.out.println(inputUser);
            return this.userDao.save(inputUser);
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

                if (!inputUser.getPassword().equals(dataBaseUser.getPassword())) {
                    if (!passwordEncoder.matches(inputUser.getPassword(), dataBaseUser.getPassword())) {

                        if (inputUser.getPassword() != null && inputUser.getPassword().length() >= 3) {
                            dataBaseUser.setPassword(passwordEncoder.encode(inputUser.getPassword()));
                        } else {
                            dataBaseUser.setPassword(dataBaseUser.getPassword());
                        }
                    } else {
                        dataBaseUser.setPassword(dataBaseUser.getPassword());
                    }
                }
                if (!dataBaseUser.getFirstName().equals(inputUser.getFirstName())) {
                    dataBaseUser.setFirstName(inputUser.getFirstName());
                }
                if (!dataBaseUser.getLastName().equals(inputUser.getLastName())) {
                    dataBaseUser.setLastName(inputUser.getLastName());
                }
                if (!dataBaseUser.getRole().equals((inputUser.getRole()))){
                    dataBaseUser.setRole(inputUser.getRole());
                }
                if (!dataBaseUser.getPicUrl().equals((inputUser.getPicUrl()))){
                    dataBaseUser.setPicUrl(inputUser.getPicUrl());
                }
            } catch (Exception ignored){ }
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

    /**
     * Used to generate a new, random password that is visible to the user in the email they receive after
     * selecting "Forgot Password?" on the front end, and opening the email that they receive.
     *
     * @return  a string representing the user's new password used to sign into the front end
     */
    public static String newPassword(String email){
        final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        for(int i = 0; i<10; i++){
            int randomIndex = random.nextInt(chars.length());
            sb.append(chars.charAt(randomIndex));
        }
        System.out.println("NEW-PASSWORD: " + sb.toString());
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(sb.toString());
        //EmailService.sendEmail(newUser, "forgot");
        return passwordEncoder.encode(sb.toString());
    }

}
