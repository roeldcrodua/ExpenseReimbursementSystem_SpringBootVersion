package com.revature.ers.services;

import com.revature.ers.models.ReimbStatus;
import com.revature.ers.models.ReimbType;
import com.revature.ers.models.Reimbursement;
import com.revature.ers.models.User;
import com.revature.ers.repository.ReimbursementDao;
import java.util.Collections;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service("reimbursementService")
public class ReimbursementService {
    private ReimbursementDao reimbursementDao;

    @Autowired
    public ReimbursementService(ReimbursementDao reimbursementDao){
        this.reimbursementDao = reimbursementDao;
    }

    public List<Reimbursement> getAllReimbursement(User sessionUser) {
        if (sessionUser.getRole().toString().equals("MANAGER")) {
            return this.reimbursementDao.findAll();
        } else {
            return this.reimbursementDao.findReimbursementByAuthor(sessionUser.getUserId());
        }
    }

    public Reimbursement createReimbursement(User sessionUser,Reimbursement reimbursement) {
        reimbursement.setAuthor(sessionUser.getUserId());
        reimbursement.setDateSubmitted(DateTime.now().toDate());
        return this.reimbursementDao.save(reimbursement);
    }

    public Reimbursement getReimbursementById(User sessionUser, Integer reimbId) {
        try {
            Reimbursement reimbursement = this.reimbursementDao.findById(reimbId).orElse(null);
            if (sessionUser.getUserId() == reimbursement.getAuthor() || sessionUser.getRole().toString().equals("MANAGER")) {
                return reimbursement;
            } else{ return null;  }
        } catch (Exception ignore){
            return null;
        }
    }

    public Reimbursement editReimbursement(User sessionUser, Reimbursement reimbursement) {
        if (sessionUser.getRole().toString().equals("MANAGER")){
            reimbursement.setResolver(sessionUser.getUserId());
            reimbursement.setDateResolved(DateTime.now().toDate());
        } else if (sessionUser.getUserId() != reimbursement.getAuthor()){
            // make sure that owner can only edit his own reimbursement
            // else you should be a Manager.
            return null;
        }
        return this.reimbursementDao.save(reimbursement);
    }

    public Boolean deleteReimbursement(User sessionUser, Integer reimbId) {
        try {
            Reimbursement reimbursement = this.reimbursementDao.findById(reimbId).orElse(null);
            // Make sure only the owner can delete the reimbursement
            // AND not yet resolved.
            if (sessionUser.getUserId() == reimbursement.getAuthor() && reimbursement.getStatus().getStatusId() == 0) {
                this.reimbursementDao.deleteById(reimbId);
                return true;
            } else return false;
        } catch (Exception ignore){
            return false;
        }
    }

    public List<Reimbursement> getAllReimbursementByStatus(User sessionUser, Integer statusId) {
        if (sessionUser.getRole().toString().equals("MANAGER")) {
            List<Reimbursement> reimbursement = this.reimbursementDao.findAll();
            return reimbursement.stream().filter(status -> status.getStatus().getStatusId() == statusId)
                    .collect(Collectors.toList());
        } else {
            List<Reimbursement> reimbursement = this.reimbursementDao.findReimbursementByAuthor(sessionUser.getUserId());
            return reimbursement.stream().filter(status -> status.getStatus().getStatusId() == statusId)
                    .collect(Collectors.toList());
        }
    }

    public List<Reimbursement> getAllReimbursementByType(User sessionUser, Integer typeId) {
        if (sessionUser.getRole().toString().equals("MANAGER")) {
            List<Reimbursement> reimbursement = this.reimbursementDao.findAll();
            return reimbursement.stream().filter(type -> type.getType().getTypeId() == typeId)
                    .collect(Collectors.toList());
        } else {
            List<Reimbursement> reimbursement = this.reimbursementDao.findReimbursementByAuthor(sessionUser.getUserId());
            return reimbursement.stream().filter(type -> type.getType().getTypeId() == typeId)
                    .collect(Collectors.toList());
        }
    }

    public List<Reimbursement> getAllReimbursementByResolver(User sessionUser) {
        if (sessionUser.getRole().toString().equals("MANAGER")) {
            return this.reimbursementDao.findReimbursementByResolver(sessionUser.getUserId());
        } else return Collections.emptyList();
    }
}
