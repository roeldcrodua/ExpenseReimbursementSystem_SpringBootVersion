package com.revature.ers.repository;

import com.revature.ers.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
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
