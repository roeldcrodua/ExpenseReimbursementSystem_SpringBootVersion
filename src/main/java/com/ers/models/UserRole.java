package com.ers.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum UserRole {
    EMPLOYEE(0),
    MANAGER(1),
    ADMIN(2);

    private int roleId;

}
