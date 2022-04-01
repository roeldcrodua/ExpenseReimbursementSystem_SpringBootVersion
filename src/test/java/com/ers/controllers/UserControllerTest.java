package com.ers.controllers;

import com.ers.models.Response;
import com.ers.models.User;
import com.ers.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class UserControllerTest {
    UserController userController;

    @Mock
    UserService userService;

    @BeforeEach
    void setUp() {
        this.userController = new UserController(userService);
    }

    @Test
    void getAllUser() {
        //assign
        List<User>  users = new ArrayList<>();
        users.add(new User(1, "roel", "crodua", "Roel", "Crodua", "roel@mail.com", null,null));
        Response expectedResult = new Response(true, "Listing all users", users);

        //mock
        Mockito.when(userService.getAllUsers()).thenReturn(users);

        //act
        Response actualResult = this.userController.getAllUser();

        //assert
        assertEquals(expectedResult, actualResult);
    }

    @Test
    void createUser() {
    }

    @Test
    void getUserById() {
    }

    @Test
    void getUserByUsername() {
    }

    @Test
    void getUserByEmail() {
    }
}