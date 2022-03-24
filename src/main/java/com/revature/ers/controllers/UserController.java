package com.revature.ers.controllers;

import com.revature.ers.models.Response;
import com.revature.ers.models.User;
import com.revature.ers.services.EmailService;
import com.revature.ers.services.ReimbursementService;
import com.revature.ers.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController("userController")
@RequestMapping(value="ers/api")
@CrossOrigin(value=CrossOriginUtil.CROSS_ORIGIN_VALUE, allowCredentials = "true")
public class UserController {
    private static final Logger logger = Logger.getLogger(UserController.class.toString());
    private UserService userService;
    public EmailService emailService = new EmailService();

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("user")
    public Response getAllUser(){
        logger.log(Level.INFO, "Listing All Users\n {0)", this.userService.getAllUsers());
        return new Response(true, "Listing all users", this.userService.getAllUsers());
    }

    @PostMapping("user")
    public Response createUser(@RequestBody User user){
        User userFromDb = this.userService.createUser(user);
        EmailService.sendEmail(userFromDb, "new");
        return new Response(true, "Adding new user", userFromDb);
    }

    @GetMapping("user/{userId}")
    public Response getUserById(@PathVariable Integer userId){
        User user = this.userService.getUserById(userId);

        if (user != null) {
            return new Response(true, "User was found", user);
        } else{
            return new Response(false, "User not found", null);
        }
    }

    @GetMapping("user/username/{username}")
    public Response getUserByUsername(@PathVariable String username){
        User user = this.userService.getUserByUsername(username);

        if (user != null) {
            return new Response(true, "User was found", user);
        } else{
            return new Response(false, "User not found", null);
        }
    }

    @GetMapping("user/email/{email}")
    public Response getUserByEmail(HttpSession session, @PathVariable String email) {
        User currentUser = this.userService.getUserByEmail(email);

        if (currentUser != null){
            return new Response(true, "User found with the associated email "+ email, currentUser);
        }else {
            return new Response(false, "Email does not exist in the system", null);
        }
    }

    @PatchMapping("user")
    public Response editUser(HttpSession session, @RequestBody User inputUser) {
        User sessionUser = (User) session.getAttribute("userInSession");
        if(sessionUser == null)
            return new Response(false, "No session found! Please login to continue.", null);

        User currentUser = this.userService.editUser(sessionUser, inputUser);
        if (currentUser != null) {
            if (BCrypt.checkpw(inputUser.getPassword(), sessionUser.getPassword())) {
                EmailService.sendEmail(currentUser, "update");
                return new Response(true, "Profile was successfully updated.", currentUser);
            } else {
                EmailService.sendEmail(currentUser, "reset");
                return new Response(true, "Password was successfully updated.", currentUser);
            }
        } else {
            return new Response(false, "Error occurred during the profile update.", null);
        }
    }

    @DeleteMapping("user/{input}")
    public Response deleteUser(HttpSession session, @PathVariable String input){
        User sessionUser = (User) session.getAttribute("userInSession");
        if(sessionUser == null)
            return new Response(false, "No session found! Please login to continue.", null);
        Boolean isDeleted = this.userService.deleteUser(sessionUser, input);
        if (Boolean.FALSE.equals(isDeleted)) {
            return new Response(false, "Error occurred during the profile deletion.", input);
        } else {
            return new Response(true, "Profile was successfully deleted.", input);
        }
    }


    @GetMapping("check-session")
    public Response checkSession(HttpSession session) {
        User user = (User) session.getAttribute("userInSession");
        if(user != null)
            return new Response(true, "Session found", user);
        else
            return new Response(false, "Session not found", null);
    }

    //Checks to see if user is in database otherwise it'll reject their log in
    @PostMapping("login")
    public Response login(HttpSession session, @RequestBody User user) {
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
                return new Response(true, "Log in successful, session created", currentUser);
            } else {
                return new Response(false, "Invalid Username or Password", null);
            }
        } catch(Exception ex){
            return new Response(false, "User not found", null);
        }
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

            String password = UserService.newPassword(oldUser.getEmail());

            User newUser = oldUser;
            newUser.setPassword(password);
            this.userService.editUser(oldUser, newUser);
            return  new Response(true, "Password was successfully updated. Forgot-reset password email sent", newUser);
        } catch (Exception ex) {
            return new Response(false, "Email/Username not found. " + ex, null);
        }
    }
}
