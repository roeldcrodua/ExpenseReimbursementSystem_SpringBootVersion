package com.revature.ers.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum UserRole {
    EMPLOYEE,
    MANAGER;

    private int roleId;
}
