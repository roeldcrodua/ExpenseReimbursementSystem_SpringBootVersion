package com.revature.ers.controllers;

import com.revature.ers.models.Response;
import com.revature.ers.models.User;
import com.revature.ers.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController("userController")
@RequestMapping(value="api")
public class UserController {
    private UserService userService;

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

    @GetMapping("user/username/{username}")
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
}
