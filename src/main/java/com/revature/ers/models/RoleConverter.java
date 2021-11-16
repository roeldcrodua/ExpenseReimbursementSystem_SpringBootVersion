package com.revature.ers.models;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.stream.Stream;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<UserRole, Integer> {
    @Override
    public Integer convertToDatabaseColumn(UserRole userRole) {
        if (userRole == null){
            return null;
        }
        return userRole.getRoleId();
    }

    @Override
    public UserRole convertToEntityAttribute(Integer roleId) {
        if (roleId == null){
            return null;
        }
        return UserRole.valueOf(Stream.of(UserRole.values())
                .filter(ur -> ur.getRoleId() == roleId)
                .findFirst().orElse(null)
                .toString());
    }
}
