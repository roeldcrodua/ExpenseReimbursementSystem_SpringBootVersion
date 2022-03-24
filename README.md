# Expense Reimbursement System - SpringBootVersion
Refactoring of Project 1 using hibernate and servlet into SpringBoot and Angular Framework

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
### USERS
- @PostMapping("user")                    -> createUser
- @GetMapping("user")                     -> getAllUser
- @GetMapping("user/id/{id}")                -> getUserById
- @GetMapping("user/username/{username}")          -> getUserByUsername
- @GetMapping("user/email/{email}")             -> getUserByEmail
- @PatchMapping("user")                   -> editUser
- @GetMapping("check-session")            -> checkSession
- @PostMapping("login")                   -> login
- @GetMapping("logout")                   -> logout
- @GetMapping("forgot-password/{email}")  -> forgotPassword

### REIMBURSEMENT
- @GetMapping("reimbursement")            -> getAllReimbursement
- @PostMapping("reimbursement")           -> createReimbursement
- @PatchMapping("reimbursement")          -> editReimbursement
- @DeleteMapping("reimbursement/{reimId}") -> deleteReimbursement
- @GetMapping("reimbursement/{reimbId}")  -> getReimbursementById
- @GetMapping("reimbursement/userId/{userId}") -> getAllOwnReimbursement
- @GetMapping("reimbursement/status/{statusId}") -> getAllReimbursementByStatus
- @GetMapping("reimbursement/type/{type}") -> getAllReimbursementByType
- @GetMapping("reimbursement/resolved")   -> getAllReimbursementByResolver

## Features Added (BACK-END)

### Basic Features
- Register as a new user
- Login as an existing user
- Edit Firstname and Lastname
- Forgot password then reset automatically through password generator
- Reset the password
- Checked for current login session
- Able to logout from the current session
- 

### Additional Features
- Added Mockito with JUnit testing 
- Added functionalities for email service
- Added password hashing using BCrypt
- Created password generator
- Added logging features using Log4j

## TODOs to be done
- Upload attachment via S3
- Use JWT for session



## Features Added (FRONT-END)

### Basic Features
- Created Login UI
- Able to create and display the main dashboard UI after login
- Populate the table containing the owned reimbursement for employee
- Populate the account information details of the employee 
-

### Additional Features
- Make it a single-page application composes of multiple components

## TODOs to be done
- Auto-repopulate the table without reloading or refrsh the page
- Add the JWT functionality

## Application Snippet
### Login Form Page
![image](https://user-images.githubusercontent.com/65931708/159846540-a37eddaf-e945-41ad-91ca-647deb4b7b74.png)


### Employee Dashboard Page
![image](https://user-images.githubusercontent.com/65931708/159846603-457585e3-1d1a-4207-a672-b74068e54de1.png)


### Finance Manager Dashboard Page


### Creating/Viewing/Editing/Processing Reimbursement Form
![image](https://user-images.githubusercontent.com/65931708/159846736-5d59bbdd-e796-4ce7-88d5-34712621d8b9.png)


### Reset Password Page


### Register new user employee

