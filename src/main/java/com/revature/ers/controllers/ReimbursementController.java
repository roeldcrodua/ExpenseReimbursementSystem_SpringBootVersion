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
    public Response getAllOwnReimbursement(HttpSession session){
        User user = (User) session.getAttribute("userInSession");
        return new Response(true, "Listing all owned reimbursement", this.reimbursementService.getAllOwnReimbursement(user));
    }

    @GetMapping("reimbursement/{id}")
    public Response getReimbursementById(@PathVariable Integer reimbId){
        Reimbursement reimbursement = this.reimbursementService.getReimbursementById(reimbId);

        if (reimbursement !=null) {
            return new Response(true, "Reimbursement found with  id " + reimbId, reimbursement);
        } else {
            return new Response(false, "Reimbursement NOT found with id " + reimbId, null);
        }
    }

    @PostMapping("reimbursement")
    public Response createReimbursement(HttpSession session, @RequestBody Reimbursement reimbursement){
        User user = (User) session.getAttribute("userInSession");
        if(user == null)
            return new Response(false, "No session found! Please login to continue.", null);

        return new Response(true, "Files a new reimbursement request", this.reimbursementService.createReimbursement(user, reimbursement));
    }

    @PatchMapping("reimbursement")
    public Response editReimbursement(HttpSession session, @RequestBody Reimbursement reimbursement){
        User sessionUser = (User) session.getAttribute("userInSession");
        if(sessionUser == null)
            return new Response(false, "No session found! Please login to continue.", null);

            Reimbursement reimbursement1 = this.reimbursementService.editReimbursement(sessionUser, reimbursement);
            if (reimbursement1 != null){
                return new Response(true, "Reimbursement updated successfully.", reimbursement);
            } else {
                return  new Response(false, "Failed to update the reimbursment", null);
            }
    }

    @DeleteMapping("reimbursement")
    public Response deleteReimbursement(HttpSession session, @PathVariable Integer reimId){
        User sessionUser = (User) session.getAttribute("userInSession");
        if(sessionUser == null)
            return new Response(false, "No session found! Please login to continue.", null);

        Boolean isDeleted = this.reimbursementService.deleteReimbursement(reimId);;
        if (Boolean.FALSE.equals(isDeleted)) {
            return new Response(false, "Error occurred during the reimbursement deletion.", reimId);
        } else {
            return new Response(true, "Reimbursement was successfully deleted.", reimId);
        }
    }

    @GetMapping("reimbursement/status/{statusId}")
    public Response getAllReimbursementByStatus(HttpSession session, @PathVariable ReimbStatus statusId){
        return new Response(true, "Listing all reimbursement according to status", this.reimbursementService.getAllReimbursementByStatus(statusId));
    }

    @GetMapping("reimbursement/type/{typeId}")
    public Response getAllReimbursementByType(HttpSession session, @PathVariable ReimbType typeId){
        return new Response(true, "Listing all reimbursement according to type", this.reimbursementService.getAllReimbursementByType((User) session.getAttribute("userInSession"), typeId));
    }

    @GetMapping("reimbursement/resolved")
    public Response getAllReimbursementByResolver(HttpSession session){
        return new Response(true, "Listing all resolved reimbursement", this.reimbursementService.getAllReimbursementByResolver((User) session.getAttribute("userInSession")));
    }
}
