package com.revature.ers.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ReimbType {
    LODGING(0),
    TRAVEL(1),
    FOOD(2),
    OTHER(3);

    private int typeId;
}
