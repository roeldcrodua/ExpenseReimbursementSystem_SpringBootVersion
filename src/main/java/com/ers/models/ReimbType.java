package com.ers.models;

import lombok.*;

@Getter
public enum ReimbType {
    LODGING(0),
    TRAVEL(1),
    FOOD(2),
    OTHER(3);

    private final int typeId;
    
    ReimbType(int typeId) {
        this.typeId = typeId;
    }

}
