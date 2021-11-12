package com.revature.ers.repository;

import com.revature.ers.models.User;
import com.revature.ers.models.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.Optional;

@Repository("userDao")
@Transactional
public interface UserDao extends JpaRepository<User, Integer> {

    @Query("from User where username = :username")
    Optional<User> findUserByUsername(String username);
    @Query("from User where email = :email")
    Optional<User> findUserByEmail(String email);

}
