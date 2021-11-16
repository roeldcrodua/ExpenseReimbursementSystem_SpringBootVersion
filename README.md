# Expense Reimbursement System - SpringBootVersion
Refactoring of Project 1 using hibernate and servlet into SpringBoot

## Project Summary
The Expense Reimbursement System (ERS) will manage the process of reimbursing employees for expenses incurred while on company time. All employees in the
company can login and submit requests for reimbursement and view their past tickets and pending requests. Finance managers can log in and view all reimbursement
requests and past history for all employees in the company. Finance managers are authorized to approve and deny requests for expense reimbursement.

## Flow Diagram

![image](https://user-images.githubusercontent.com/65931708/132281265-e071a15a-d745-41d5-9af5-b10f4254ea61.png)

## Case Diagram

![image](https://user-images.githubusercontent.com/65931708/132281360-08a01b6a-772c-44c2-8326-3d191696f9a3.png)

## Technologies Involved
- Spring Boot


## Possible servelets endpoints:
- @PostMapping("user")                    -> createUser
- @GetMapping("user")                     -> getAllUser
- @GetMapping("user/{id}")                -> getUserById
- @GetMapping("user/{username}")          -> getUserByUsername
- @GetMapping("user/{email}")             -> getUserByEmail
- @PatchMapping("user")                   -> editUser
- @GetMapping("check-session")            -> checkSession
- @PostMapping("login")                   -> login
- @GetMapping("logout")                   -> logout
- @GetMapping("forgot-password/{email}")  -> forgotPassword


- /api/reimbursement
   - POST - addNewReimbursement
   - PATCH - editAReimbursement
   - DELETE - deleteAReimbursement
   - GET - getOneReimbursement
- /api/reimbursements
   - GET - getAllOwnReimbursement
- /api/resolve
    - PUT - resolveAReimbursement
    - GET - getAllListOfResolvedReimbursement
- /api/manager
    GET - getListOfAllPendingReimbursements  

## Features

- Added Mockito with JUnit testing 
- Added optional functionalities for email
- Added optional password hashing
- Create a password generator
- Get the User full name and display in the client side
- Applied Responsive website design

### TODOs to be done
- Upload attachment via S3

## Application Snippet
### Login Form Page


### Employee Dashboard Page


### Finance Manager Dashboard Page


### Creating/Viewing/Editing/Processing Reimbursement Form


### Reset Password Page


### Register new user employee

