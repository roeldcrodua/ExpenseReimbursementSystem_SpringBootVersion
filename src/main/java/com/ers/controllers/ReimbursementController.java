package com.ers.controllers;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.ers.models.*;
import com.ers.services.JWTService;
import com.ers.services.ReimbursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController("reimbursementController")
@RequestMapping(value="ers/api")
@CrossOrigin(value= CrossOriginUtil.CROSS_ORIGIN_VALUE, allowCredentials = "true")
public class ReimbursementController {
    private ReimbursementService reimbursementService;
    private JWTService jwtService;

    @Autowired
    public ReimbursementController(ReimbursementService reimbursementService, JWTService jwtService) {
        this.reimbursementService = reimbursementService;
        this.jwtService = jwtService;
    }

    @GetMapping("reimbursement")
    public Response getAllReimbursement(@RequestHeader Map<String, String> header){
        try {
            DecodedJWT decoded = jwtService.verify(header.get("authorization"));
            if (decoded == null) {
                return new Response(false, "Invalid Token, try again.", null);
            } else {
                User user = new User();
                user.setUserId(decoded.getClaims().get("userId").asInt());
                user.setUserName(decoded.getClaims().get("userName").toString());
                user.setFirstName(decoded.getClaims().get("firstName").toString());
                user.setLastName(decoded.getClaims().get("lastName").toString());
                user.setEmail(decoded.getClaims().get("email").toString());
                user.setRole(UserRole.valueOf(decoded.getClaims().get("role").toString().substring(1,decoded.getClaims().get("role").toString().length()-1)));

                return new Response(true, "Listing all reimbursement", this.reimbursementService.getAllReimbursement(user));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return new Response(false, "Exception encountered", null);
        }
    }

    @GetMapping("reimbursement/{reimbId}")
    public Response getReimbursementById(@PathVariable Integer reimbId, @RequestHeader Map<String, String> header){
        try {
            DecodedJWT decoded = jwtService.verify(header.get("authorization"));
            if (decoded == null) {
                return new Response(false, "Invalid Token, try again.", null);
            } else {
                User user = new User();
                user.setUserId(decoded.getClaims().get("userId").asInt());
                user.setUserName(decoded.getClaims().get("userName").toString());
                user.setFirstName(decoded.getClaims().get("firstName").toString());
                user.setLastName(decoded.getClaims().get("lastName").toString());
                user.setEmail(decoded.getClaims().get("email").toString());
                user.setRole(UserRole.valueOf(decoded.getClaims().get("role").toString().substring(1,decoded.getClaims().get("role").toString().length()-1)));

                if (user == null)
                    return new Response(false, "No session found! Please login to continue.", null);

                Reimbursement reimbursement = this.reimbursementService.getReimbursementById(user, reimbId);

                if (reimbursement != null) {
                    return new Response(true, "Reimbursement found with  id " + reimbId, reimbursement);
                } else {
                    return new Response(false, "Reimbursement NOT found or NOT permitted to open with id " + reimbId, null);
                }
            }

        } catch (Exception ex){
                ex.printStackTrace();
                return new Response(false, "Exception encountered", null);
        }
    }

    @GetMapping("reimbursement/userId/{userId}")
    public Response getAllOwnReimbursement(@PathVariable Integer userId, @RequestHeader Map<String, String> header) {
        try {
            DecodedJWT decoded = jwtService.verify(header.get("authorization"));
            if (decoded == null) {
                return new Response(false, "Invalid Token, try again.", null);
            } else {
                User user = new User();
                user.setUserId(decoded.getClaims().get("userId").asInt());
                user.setUserName(decoded.getClaims().get("userName").toString());
                user.setFirstName(decoded.getClaims().get("firstName").toString());
                user.setLastName(decoded.getClaims().get("lastName").toString());
                user.setEmail(decoded.getClaims().get("email").toString());
                user.setRole(UserRole.valueOf(decoded.getClaims().get("role").toString().substring(1,decoded.getClaims().get("role").toString().length()-1)));

                if (user == null)
                    return new Response(false, "No session found! Please login to continue.", null);

                return new Response(true, "Listing all owned reimbursement", this.reimbursementService.getAllReimbursement(user));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return new Response(false, "Exception encountered", null);
        }
    }

    @PostMapping("reimbursement")
    public Response createReimbursement(@RequestBody Reimbursement reimbursement,@RequestHeader Map<String, String> header) {
        try {
            DecodedJWT decoded = jwtService.verify(header.get("authorization"));
            if (decoded == null) {
                return new Response(false, "Invalid Token, try again.", null);
            } else {
                User user = new User();
                user.setUserId(decoded.getClaims().get("userId").asInt());
                user.setUserName(decoded.getClaims().get("userName").toString());
                user.setFirstName(decoded.getClaims().get("firstName").toString());
                user.setLastName(decoded.getClaims().get("lastName").toString());
                user.setEmail(decoded.getClaims().get("email").toString());
                user.setRole(UserRole.valueOf(decoded.getClaims().get("role").toString().substring(1,decoded.getClaims().get("role").toString().length()-1)));

                if (user == null)
                    return new Response(false, "No session found! Please login to continue.", null);

                return new Response(true, "Successfully filed a new reimbursement request", this.reimbursementService.createReimbursement(user, reimbursement));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return new Response(false, "Exception encountered", null);
        }
    }

    @PatchMapping("reimbursement")
    public Response editReimbursement(@RequestBody Reimbursement reimbursement, @RequestHeader Map<String, String> header) {
        try {
            DecodedJWT decoded = jwtService.verify(header.get("authorization"));
            if (decoded == null) {
                return new Response(false, "Invalid Token, try again.", null);
            } else {
                User user = new User();
                user.setUserId(decoded.getClaims().get("userId").asInt());
                user.setUserName(decoded.getClaims().get("userName").toString());
                user.setFirstName(decoded.getClaims().get("firstName").toString());
                user.setLastName(decoded.getClaims().get("lastName").toString());
                user.setEmail(decoded.getClaims().get("email").toString());
                user.setRole(UserRole.valueOf(decoded.getClaims().get("role").toString().substring(1,decoded.getClaims().get("role").toString().length()-1)));

                if (user == null)
                    return new Response(false, "No session found! Please login to continue.", null);

                Reimbursement reimbursement1 = this.reimbursementService.editReimbursement(user, reimbursement);
                if (reimbursement1 != null) {
                    return new Response(true, "Reimbursement updated successfully.", reimbursement);
                } else {
                    return new Response(false, "Failed to update the reimbursement", null);
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return new Response(false, "Exception encountered", null);
        }
    }

    @DeleteMapping("reimbursement/{reimId}")
    public Response deleteReimbursement(@PathVariable Integer reimId, @RequestHeader Map<String, String> header) {
        try {
            DecodedJWT decoded = jwtService.verify(header.get("authorization"));
            if (decoded == null) {
                return new Response(false, "Invalid Token, try again.", null);
            } else {
                User user = new User();
                user.setUserId(decoded.getClaims().get("userId").asInt());
                user.setUserName(decoded.getClaims().get("userName").toString());
                user.setFirstName(decoded.getClaims().get("firstName").toString());
                user.setLastName(decoded.getClaims().get("lastName").toString());
                user.setEmail(decoded.getClaims().get("email").toString());
                user.setRole(UserRole.valueOf(decoded.getClaims().get("role").toString().substring(1,decoded.getClaims().get("role").toString().length()-1)));

                if (user == null)
                    return new Response(false, "No session found! Please login to continue.", null);

                Boolean isDeleted = this.reimbursementService.deleteReimbursement(user, reimId);
                ;
                if (Boolean.FALSE.equals(isDeleted)) {
                    return new Response(false, "Error occurred during the reimbursement deletion. Possible reason: NOT PERMITTED or ALREADY RESOLVED.", reimId);
                } else {
                    return new Response(true, "Reimbursement was successfully deleted.", reimId);
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return new Response(false, "Exception encountered", null);
        }
    }

    @GetMapping("reimbursement/status/{statusId}")
    public Response getAllReimbursementByStatus(@PathVariable Integer statusId, @RequestHeader Map<String, String> header) {
        try {
            DecodedJWT decoded = jwtService.verify(header.get("authorization"));
            if (decoded == null) {
                return new Response(false, "Invalid Token, try again.", null);
            } else {
                User user = new User();
                user.setUserId(decoded.getClaims().get("userId").asInt());
                user.setUserName(decoded.getClaims().get("userName").toString());
                user.setFirstName(decoded.getClaims().get("firstName").toString());
                user.setLastName(decoded.getClaims().get("lastName").toString());
                user.setEmail(decoded.getClaims().get("email").toString());
                user.setRole(UserRole.valueOf(decoded.getClaims().get("role").toString().substring(1,decoded.getClaims().get("role").toString().length()-1)));

                if (user == null)
                    return new Response(false, "No session found! Please login to continue.", null);

                return new Response(true, "Listing all reimbursement according to status", this.reimbursementService.getAllReimbursementByStatus(user, statusId));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return new Response(false, "Exception encountered", null);
        }
    }

    @GetMapping("reimbursement/type/{type}")
    public Response getAllReimbursementByType(@PathVariable Integer type, @RequestHeader Map<String, String> header) {
        try {
            DecodedJWT decoded = jwtService.verify(header.get("authorization"));
            if (decoded == null) {
                return new Response(false, "Invalid Token, try again.", null);
            } else {
                User user = new User();
                user.setUserId(decoded.getClaims().get("userId").asInt());
                user.setUserName(decoded.getClaims().get("userName").toString());
                user.setFirstName(decoded.getClaims().get("firstName").toString());
                user.setLastName(decoded.getClaims().get("lastName").toString());
                user.setEmail(decoded.getClaims().get("email").toString());
                user.setRole(UserRole.valueOf(decoded.getClaims().get("role").toString().substring(1,decoded.getClaims().get("role").toString().length()-1)));

                if (user == null)
                    return new Response(false, "No session found! Please login to continue.", null);

                return new Response(true, "Listing all reimbursement according to type", this.reimbursementService.getAllReimbursementByType(user, type));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return new Response(false, "Exception encountered", null);
        }
    }

    @GetMapping("reimbursement/resolved")
    public Response getAllReimbursementByResolver(@RequestHeader Map<String, String> header) {
        try {
            DecodedJWT decoded = jwtService.verify(header.get("authorization"));
            if (decoded == null) {
                return new Response(false, "Invalid Token, try again.", null);
            } else {
                User user = new User();
                user.setUserId(decoded.getClaims().get("userId").asInt());
                user.setUserName(decoded.getClaims().get("userName").toString());
                user.setFirstName(decoded.getClaims().get("firstName").toString());
                user.setLastName(decoded.getClaims().get("lastName").toString());
                user.setEmail(decoded.getClaims().get("email").toString());
                user.setRole(UserRole.valueOf(decoded.getClaims().get("role").toString().substring(1,decoded.getClaims().get("role").toString().length()-1)));

                if (user == null)
                    return new Response(false, "No session found! Please login to continue.", null);

                return new Response(true, "Listing all resolved reimbursement", this.reimbursementService.getAllReimbursementByResolver(user));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return new Response(false, "Exception encountered", null);
        }
    }
}
