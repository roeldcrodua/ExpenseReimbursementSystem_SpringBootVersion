package com.ers.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ReimbStatus {
    PENDING(0),
    APPROVED(1),
    DENIED(2);

    private int statusId;
}
