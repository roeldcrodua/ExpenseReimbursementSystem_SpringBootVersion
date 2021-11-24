package com.revature.ers.controllers;

import com.revature.ers.models.*;
import com.revature.ers.services.ReimbursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController("reimbursementController")
@RequestMapping(value="api")
public class ReimbursementController {
    private ReimbursementService reimbursementService;

    @Autowired
    public ReimbursementController(ReimbursementService reimbursementService) {
        this.reimbursementService = reimbursementService;
    }

    @GetMapping("reimbursement")
    public Response getAllReimbursement(HttpSession sessionUser){
        User user = (User) sessionUser.getAttribute("userInSession");
        if(user == null)
            return new Response(false, "No session found! Please login to continue.", null);

        return new Response(true, "Listing all reimbursement", this.reimbursementService.getAllReimbursement(user));
    }

    @GetMapping("reimbursement/{reimbId}")
    public Response getReimbursementById(HttpSession sessionUser, @PathVariable Integer reimbId){
        User user = (User) sessionUser.getAttribute("userInSession");
        if(user == null)
            return new Response(false, "No session found! Please login to continue.", null);

        Reimbursement reimbursement = this.reimbursementService.getReimbursementById(user, reimbId);

        if (reimbursement !=null) {
            return new Response(true, "Reimbursement found with  id " + reimbId, reimbursement);
        } else {
            return new Response(false, "Reimbursement NOT found or NOT permitted to open with id " + reimbId, null);
        }
    }

    @GetMapping("reimbursement/userId/{userId}")
    public Response getAllOwnReimbursement(HttpSession sessionUser, @PathVariable Integer userId){
        User user = (User) sessionUser.getAttribute("userInSession");
        if(user == null)
            return new Response(false, "No session found! Please login to continue.", null);

        return new Response(true, "Listing all owned reimbursement", this.reimbursementService.getAllReimbursement(user));
    }

    @PostMapping("reimbursement")
    public Response createReimbursement(HttpSession sessionUser, @RequestBody Reimbursement reimbursement){
        User user = (User) sessionUser.getAttribute("userInSession");
        if(user == null)
            return new Response(false, "No session found! Please login to continue.", null);

        return new Response(true, "Successfully filed a new reimbursement request", this.reimbursementService.createReimbursement(user, reimbursement));
    }

    @PatchMapping("reimbursement")
    public Response editReimbursement(HttpSession sessionUser, @RequestBody Reimbursement reimbursement){
        User user = (User) sessionUser.getAttribute("userInSession");
        if(user == null)
            return new Response(false, "No session found! Please login to continue.", null);

            Reimbursement reimbursement1 = this.reimbursementService.editReimbursement(user, reimbursement);
            if (reimbursement1 != null){
                return new Response(true, "Reimbursement updated successfully.", reimbursement);
            } else {
                return  new Response(false, "Failed to update the reimbursement", null);
            }
    }

    @DeleteMapping("reimbursement/{reimId}")
    public Response deleteReimbursement(HttpSession sessionUser, @PathVariable Integer reimId){
        User user = (User) sessionUser.getAttribute("userInSession");
        if(user == null)
            return new Response(false, "No session found! Please login to continue.", null);

        Boolean isDeleted = this.reimbursementService.deleteReimbursement(user, reimId);;
        if (Boolean.FALSE.equals(isDeleted)) {
            return new Response(false, "Error occurred during the reimbursement deletion. Possible reason: NOT PERMITTED or ALREADY RESOLVED.", reimId);
        } else {
            return new Response(true, "Reimbursement was successfully deleted.", reimId);
        }
    }

    @GetMapping("reimbursement/status/{statusId}")
    public Response getAllReimbursementByStatus(HttpSession sessionUser, @PathVariable Integer statusId){
        User user = (User) sessionUser.getAttribute("userInSession");
        if(user == null)
            return new Response(false, "No session found! Please login to continue.", null);

        return new Response(true, "Listing all reimbursement according to status", this.reimbursementService.getAllReimbursementByStatus(user, statusId));
    }

    @GetMapping("reimbursement/type/{type}")
    public Response getAllReimbursementByType(HttpSession sessionUser, @PathVariable Integer type){
        User user = (User) sessionUser.getAttribute("userInSession");
        if(user == null)
            return new Response(false, "No session found! Please login to continue.", null);

        return new Response(true, "Listing all reimbursement according to type", this.reimbursementService.getAllReimbursementByType((User) sessionUser.getAttribute("userInSession"), type));
    }

    @GetMapping("reimbursement/resolved")
    public Response getAllReimbursementByResolver(HttpSession sessionUser){
        User user = (User) sessionUser.getAttribute("userInSession");
        if(user == null)
            return new Response(false, "No session found! Please login to continue.", null);

        return new Response(true, "Listing all resolved reimbursement", this.reimbursementService.getAllReimbursementByResolver((User) sessionUser.getAttribute("userInSession")));
    }
}
