package com.ers.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(name="userid")
    private int userId;

    @Column(name="username", unique = true, nullable = false)
    private String userName;

    @Column(name="password", nullable = false)
    private String password;

    @Column(name="first_name", nullable = false)
    private String firstName;

    @Column(name="last_name", nullable = false)
    private String lastName;

    @Column(name="email", unique = true, nullable = false)
    private String email;

    @Column(name="role",  nullable = false)
    private UserRole role;

    @Column(name="pic_url")
    private String picUrl;

}
