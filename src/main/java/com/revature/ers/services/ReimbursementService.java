package com.revature.ers.services;

import com.revature.ers.models.ReimbStatus;
import com.revature.ers.models.ReimbType;
import com.revature.ers.models.Reimbursement;
import com.revature.ers.models.User;
import com.revature.ers.repository.ReimbursementDao;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("reimbursementService")
public class ReimbursementService {
    private ReimbursementDao reimbursementDao;

    @Autowired
    public ReimbursementService(ReimbursementDao reimbursementDao){
        this.reimbursementDao = reimbursementDao;
    }

    public List<Reimbursement> getAllOwnReimbursement(User user) {
        return this.reimbursementDao.findReimbursementByAuthor(user.getUserId());
    }

    public Reimbursement createReimbursement(User sessionUser,Reimbursement reimbursement) {
        reimbursement.setAuthor(sessionUser.getUserId());
        reimbursement.setDateSubmitted(DateTime.now().toDate());
        return this.reimbursementDao.save(reimbursement);
    }

    public Reimbursement getReimbursementById(Integer reimbId) {
        return this.reimbursementDao.findById(reimbId).orElse(null);
    }

    public Reimbursement editReimbursement(User sessionUser, Reimbursement reimbursement) {
        System.out.println("SESSION-USER: " + sessionUser);
        if (sessionUser.getRole().toString().equals("MANAGER")){
            reimbursement.setResolver(sessionUser.getUserId());
            reimbursement.setDateResolved(DateTime.now().toDate());
        }
        System.out.println("REIMBURSEMENT: " + reimbursement);
        return this.reimbursementDao.save(reimbursement);
    }

    public Boolean deleteReimbursement(Integer reimId) {
        try {
            this.reimbursementDao.deleteById(reimId);
            return true;
        } catch (Exception ignore){
            return false;
        }
    }

    public List<Reimbursement> getAllReimbursementByStatus(ReimbStatus status) {
        return this.reimbursementDao.findReimbursementByStatus(status.getStatusId());
    }

    public List<Reimbursement> getAllReimbursementByType(User userInSession, ReimbType typeId) {
        return this.reimbursementDao.findReimbursementByType(typeId.getTypeId());
    }

    public List<Reimbursement> getAllReimbursementByResolver(User userInSession) {
        return this.reimbursementDao.findReimbursementByResolver(userInSession.getUserId());
    }
}
