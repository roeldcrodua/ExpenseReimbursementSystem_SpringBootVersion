package com.ers.controllers;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.ers.models.Response;
import com.ers.models.User;
import com.ers.services.EmailService;
import com.ers.services.JWTService;
import com.ers.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("userController")
@RequestMapping(value="ers/api")
@CrossOrigin(value= CrossOriginUtil.CROSS_ORIGIN_VALUE, allowCredentials = "true")
public class UserController {
    private UserService userService;
    public EmailService emailService = new EmailService();
    private JWTService jwtService = new JWTService();

    @Autowired
    public UserController(UserService userService, JWTService jwtService){
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("user/verify")
    public Response verifyUser(@RequestBody String user){
        try {
            return new Response(true, "Verified user", this.userService.verifyUser(user));
        } catch (Exception ex){
            ex.printStackTrace();
            return new Response(false, "User not found", null);
        }
    }

    @PostMapping("user")
    public Response createUser(@RequestBody User user){
        System.out.println("IN CREATE USER Controller");
        User userFromDb = this.userService.createUser(user);
        if (userFromDb == null) {
            return new Response(false, "Failed to create a new user", null);
        } else {
            //EmailService.sendEmail(userFromDb, "new");
            return new Response(true, jwtService.genToken(userFromDb), userFromDb);
        }
    }

    @GetMapping("user/{userId}")
    public Response getUserById(@PathVariable Integer userId, @RequestHeader Map<String, String> header){
        DecodedJWT decoded = jwtService.verify(header.get("authorization"));
        if (decoded == null) {
            return new Response(false, "Invalid Token, try again.", null);
        } else {
            User user = this.userService.getUserById(userId);

            if (user != null) {
                return new Response(true, jwtService.genToken(user), user);
            } else {
                return new Response(false, "User not found", null);
            }
        }
    }

    @GetMapping("user/username/{username}")
    public Response getUserByUsername(@PathVariable String username, @RequestHeader Map<String, String> header){
        DecodedJWT decoded = jwtService.verify(header.get("authorization"));
        if (decoded == null) {
            return new Response(false, "Invalid Token, try again.", null);
        } else {
            User user = this.userService.getUserByUsername(username);

            if (user != null) {
                return new Response(true, jwtService.genToken(user), user);
            } else {
                return new Response(false, "User not found", null);
            }
        }
    }

    @GetMapping("user/email/{email}")
    public Response getUserByEmail(@PathVariable String email, @RequestHeader Map<String, String> header){
        DecodedJWT decoded = jwtService.verify(header.get("authorization"));
        if (decoded == null) {
            return new Response(false, "Invalid Token, try again.", null);
        } else {
            User currentUser = this.userService.getUserByEmail(email);

            if (currentUser != null) {
                return new Response(true, "Email was found in the system", currentUser);
            } else {
                return new Response(false, "Email does not exist in the system", null);
            }
        }
    }

    @PatchMapping("user")
    public Response editUser(@RequestBody User inputUser,@RequestHeader Map<String, String> header){
        DecodedJWT decoded = jwtService.verify(header.get("authorization"));
        System.out.println("EDIT USER");
        System.out.println(inputUser);

        if (decoded == null) {
            return new Response(false, "Invalid Token, try again.", null);
        } else {
            String userNameString = decoded.getClaims().get("userName").toString();
            System.out.println("TOKEN USERNAME");
            System.out.println(userNameString.substring(1,userNameString.length()-1));
            if (userNameString.substring(1,userNameString.length()-1).equals(inputUser.getUserName())) {

                User sessionUser = new User();
                sessionUser.setUserId(decoded.getClaims().get("userId").asInt());
                System.out.println("SESSION USER");
                System.out.println(sessionUser);
                User currentUser = this.userService.editUser(sessionUser, inputUser);
                if (currentUser != null) {
                    if (inputUser.getPassword().equals(currentUser.getPassword())) {
                        //EmailService.sendEmail(currentUser, "update");
                        return new Response(true, "Profile was successfully updated.", currentUser);
                    } else {
                        //EmailService.sendEmail(currentUser, "reset");
                        return new Response(true, "Password was successfully updated.", currentUser);
                    }
                }
            } else {
                if (decoded.getClaims().get("role").toString().matches("MANAGER")){
                    User sessionUser = new User();
                    sessionUser.setUserId(decoded.getClaims().get("userId").asInt());
                    User currentUser = this.userService.editUser(sessionUser, inputUser);
                    //EmailService.sendEmail(currentUser, "update");
                    return new Response(true, "Profile was successfully updated.", currentUser);
                }
            }
            return new Response(false, "Error occurred during the profile update.", null);
        }
     }

    //Checks to see if user is in database otherwise it'll reject their log in
    @PostMapping("login")
    public Response login(@RequestBody User user) {
        try {
            User currentUser;
            if (!user.getUserName().isEmpty()){
                currentUser = this.userService.getUserByUsername(user.getUserName());
            } else if (!user.getEmail().isEmpty()){
                currentUser = this.userService.getUserByEmail(user.getEmail());
            } else {
                currentUser = null;
            }

            if (currentUser !=null) {
                // Use BCrypt checkpw() method to see if the input password matches the hashed value of the password
                if (BCrypt.checkpw(user.getPassword(), currentUser.getPassword())) {
                    return new Response(true, jwtService.genToken(currentUser), null);
                } else {
                    return new Response(false, "Invalid Username or Password", null);
                }
            }
            return new Response(false, "User not found", null);
        } catch(Exception ex){
            return new Response(false, "Error encountered during login", null);
        }
    }


    @PatchMapping("forgot-password/{email}")
    public Response forgotPassword(@PathVariable String email){
        try {
            User oldUser;
            System.out.println("IN FORGOT PASSWORD");
            System.out.println(email);
            if (email.contains("@")) {
                oldUser = this.userService.getUserByEmail(email);
            } else {
                oldUser = this.userService.getUserByUsername(email);
            }
            System.out.println(oldUser);
            if (oldUser != null) {
                String password = UserService.newPassword(oldUser.getEmail());

                User newUser;
                newUser = oldUser;
                newUser.setPassword(password);
                this.userService.editUser(oldUser, newUser);
                return new Response(true, jwtService.genToken(newUser), null);
            }
            return new Response(false, "Email/Username not found. ", null);
        } catch (Exception ex) {
            return new Response(false, "Error encountered during forgot password. " + ex, null);
        }
    }

}
