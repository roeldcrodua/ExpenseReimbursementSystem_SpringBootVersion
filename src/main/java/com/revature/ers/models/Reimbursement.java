package com.revature.ers.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="reimbursement")
public class Reimbursement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="reim_id")
    private int reimbId;

    @Column(name="amount", nullable = false)
    private int amount;

    @Column(name="date_submitted", nullable = false)
    private Date dateSubmitted;

    @Column(name="date_resolved")
    private Date dateResolved;

    @Column(name="description", nullable = false)
    private String description;

    @Column(name="receipt")
    private String receipt;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private User author;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private User resolver;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private ReimbStatus status;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private ReimbType type;
}
