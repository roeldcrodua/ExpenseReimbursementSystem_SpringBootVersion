package com.ers.models;

import lombok.Getter;


@Getter
public enum ReimbStatus {
    PENDING(0),
    APPROVED(1),
    DENIED(2);

    private final int statusId;
    
    ReimbStatus(int statusId) {
        this.statusId = statusId;
    }
}
