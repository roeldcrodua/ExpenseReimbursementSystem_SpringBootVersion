package com.revature.ers.models;

import com.revature.ers.models.ReimbType;
import com.revature.ers.models.UserRole;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.stream.Stream;

@Converter(autoApply = true)
public class TypeConverter implements AttributeConverter<ReimbType, Integer> {

    /**
     * Converts the value stored in the entity attribute into the
     * data representation to be stored in the database.
     *
     * @param type the entity attribute value to be converted
     * @return the converted data to be stored in the database
     * column
     */
    @Override
    public Integer convertToDatabaseColumn(ReimbType type) {
        if (type == null) {
            return null;
        }
        return type.getTypeId();
    }

    /**
     * Converts the data stored in the database column into the
     * value to be stored in the entity attribute.
     * Note that it is the responsibility of the converter writer to
     * specify the correct <code>dbData</code> type for the corresponding
     * column for use by the JDBC driver: i.e., persistence providers are
     * not expected to do such type conversion.
     *
     * @param typeId the data from the database column to be
     *               converted
     * @return the converted value to be stored in the entity
     * attribute
     */
    @Override
    public ReimbType convertToEntityAttribute(Integer typeId) {
        if (typeId == null){
            return null;
        }
        return ReimbType.valueOf(Stream.of(ReimbType.values())
                .filter(rt -> rt.getTypeId() == typeId)
                .findFirst().orElse(null)
                .toString());
    }
}
