package com.ers.models;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.stream.Stream;

@Converter(autoApply = true)
public class StatusConverter implements AttributeConverter<ReimbStatus, Integer> {
    /**
     * Converts the value stored in the entity attribute into the
     * data representation to be stored in the database.
     *
     * @param status the entity attribute value to be converted
     * @return the converted data to be stored in the database
     * column
     */
    @Override
    public Integer convertToDatabaseColumn(ReimbStatus status) {
        if (status == null){
            return null;
        }
        return status.getStatusId();
    }

    /**
     * Converts the data stored in the database column into the
     * value to be stored in the entity attribute.
     * Note that it is the responsibility of the converter writer to
     * specify the correct <code>dbData</code> type for the corresponding
     * column for use by the JDBC driver: i.e., persistence providers are
     * not expected to do such type conversion.
     *
     * @param statusId the data from the database column to be
     *               converted
     * @return the converted value to be stored in the entity
     * attribute
     */
    @Override
    public ReimbStatus convertToEntityAttribute(Integer statusId) {
        if (statusId == null){
            return null;
        }
        return ReimbStatus.valueOf(Stream.of(ReimbStatus.values())
                .filter(rs -> rs.getStatusId() == statusId)
                .findFirst().orElse(null)
                .toString());
    }
}
