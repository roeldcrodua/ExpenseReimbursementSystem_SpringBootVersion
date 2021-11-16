package com.revature.ers.controllers;

import com.revature.ers.models.Response;
import com.revature.ers.models.User;
import com.revature.ers.services.EmailService;
import com.revature.ers.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController("userController")
@RequestMapping(value="api")
public class UserController {
    private UserService userService;
    private EmailService emailService;
    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("user")
    public Response getAllUser(){
        return new Response(true, "Listing all users", this.userService.getAllUsers());
    }

    @PostMapping("user")
    public Response createUser(@RequestBody User user){
        User userFromDb = this.userService.createUser(user);
        return new Response(true, "Adding new user", userFromDb);
    }

    @GetMapping("user/{id}")
    public Response getUserById(@PathVariable Integer userId){
        Response response;
        User user = this.userService.getUserById(userId);

        if (user != null) {
            response = new Response(true, "User was found", user);
        } else{
            response = new Response(false, "User not found", null);
        }
        return response;
    }

    @GetMapping("user/{username}")
    public Response getUserByUsername(@PathVariable String username){
        Response response;
        User user = this.userService.getUserByUsername(username);

        if (user != null) {
            response = new Response(true, "User was found", user);
        } else{
            response = new Response(false, "User not found", null);
        }
        return response;
    }

    @GetMapping("user/{email}")
    public Response getUserByEmail(HttpSession session, @PathVariable String email) {
        Response response;
        User currentUser = this.userService.getUserByEmail(email);

        if (currentUser != null){
            response = new Response(true, "User found with the associated email "+ email, currentUser);
        }else {
            response = new Response(false, "Email does not exist in the system", null);
        }
        return response;
    }

    @PatchMapping("user")
    public Response editUser(HttpSession session, @RequestBody User inputUser) {
        Response response = null;

        User sessionUser = (User) session.getAttribute("userInSession");
        if(sessionUser == null)
            return new Response(false, "No session found! Please login to continue.", null);

        User currentUser = this.userService.editUser(sessionUser, inputUser);
        if (currentUser != null) {
            try {
                if (BCrypt.checkpw(inputUser.getPassword(), sessionUser.getPassword())) {
                    response = new Response(true, "Profile was successfully updated.", currentUser);
                }
            } catch(Exception ex){
                response = new Response(true, "Password was successfully updated.", currentUser);
            }
        } else {
            response = new Response(false, "Error occurred during the profile update.", null);
        }
        return response;
    }

    @GetMapping("check-session")
    public Response checkSession(HttpSession session) {
        Response response;
        User user = (User) session.getAttribute("userInSession");
        if(user != null)
            response = new Response(true, "Session found", user);
        else
            response = new Response(false, "Session not found", null);
        return response;
    }

    //Checks to see if user is in database otherwise it'll reject their log in
    @PostMapping("login")
    public Response login(HttpSession session, @RequestBody User user) {
        Response response;
        try {
            User currentUser;
            if (!user.getUserName().isEmpty()){
                currentUser = this.userService.getUserByUsername(user.getUserName());
            } else if (!user.getEmail().isEmpty()){
                currentUser = this.userService.getUserByEmail(user.getEmail());
            } else {
                currentUser = null;
            }

            // Use BCrypt checkpw() method to see if the input password matches the hashed value of the password
            if (BCrypt.checkpw(user.getPassword(), currentUser.getPassword())) {
                session.setAttribute("userInSession", currentUser);
                response = new Response(true, "Log in successful, session created", currentUser);
            } else {
                response = new Response(false, "Invalid Username or Password", null);
            }
        } catch(Exception ex){
            response = new Response(false, "User not found", null);
        }
        return response;
    }


    @GetMapping("logout")
    public Response logout(HttpSession session) {
        session.setAttribute("userInSession", null);
        return new Response(true, "Session terminated", null);
    }

    @PatchMapping("forgot-password/{email}")
    public Response forgotPassword(@PathVariable String email) {
        try{
            User oldUser;
            if (email.contains("@")){
                oldUser = this.userService.getUserByEmail(email);
            } else {
                oldUser = this.userService.getUserByUsername(email);
            }
            User newUser = oldUser;
            String password = emailService.sendNewPassword(oldUser.getEmail(), oldUser.getFirstName() + " " + oldUser.getLastName());
            newUser.setPassword(password);
            this.userService.editUser(oldUser, newUser);
            return  new Response(true, "Password was successfully updated. Forgot-reset password email sent", newUser);
        } catch (Exception ex) {
            return new Response(false, "Email/Username not found" + ex, null);
        }
    }
}
