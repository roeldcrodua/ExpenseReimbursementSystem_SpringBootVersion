package com.ers.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name="reimbursement")
public class Reimbursement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="reim_id")
    private int reimbId;

    @Column(name="amount", nullable = false)
    private double amount;

    @Column(name="date_submitted", nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM-dd-yyyy HH-mm-ss")
    private Date dateSubmitted;

    @Column(name="date_resolved")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM-dd-yyyy HH-mm-ss")
    private Date dateResolved;

    @Column(name="description", nullable = false)
    private String description;

    @Column(name="receipt")
    private String receipt;

    @Column(name="author", nullable = false)
    private Integer author;

    @Column(name="resolver")
    private Integer resolver;

    @Column(name="status", nullable = false)
    private ReimbStatus status;

    @Column(name="remarks")
    private String remarks;

    @Column(name="type", nullable = false)
    private ReimbType type;
}
