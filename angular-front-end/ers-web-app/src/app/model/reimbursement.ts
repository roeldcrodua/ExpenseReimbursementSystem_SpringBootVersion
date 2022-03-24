export interface Reimbursement {
    reimbId: number,
    amount: number,
    dateSubmitted: String,
    dateResolved: String,
    description: String,
    receipt: String,
    author: number,
    resolver: number,
    status: any,
    type: any
}