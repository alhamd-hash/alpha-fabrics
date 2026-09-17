# Security Specification - Al-Hamd Fabrics

## 1. Data Invariants
- An order can be created by any anonymous guest public user but must match valid types. Once placed, its details elements (other than `status` during processing) are immutable.
- A review can be submitted by any customer guest but is pending state (`approved: false`) initially. Only authorized admin can approve and toggle `approved` true.
- A user can only access/query reviews that are approved, and their own orders (queried specifically if verified/anonymous or offline trackers).

## 2. Attacker Payloads ("Dirty Dozen")
1. **Hijacked Status Update**: A threat actor tries to mark their unpaid order as 'Delivered' immediately.
2. **Review Hijack Injection**: A competitor submits a review with `approved: true` to bypass moderation and post fake ratings.
3. **Invalid Email Formats**: Attackers sending null or empty customerName strings.
4. **Denial of Wallet (DoW) Key Blowup**: Injected massive 2MB strings inside rating description texts.
5. **Rating Boundary Violation**: Sending a review with rating `10` or `-5` stars.
6. **Immutable Field Attack**: Modifying `createdAt` or `productId` on an existing approved review.
7. **Negative Invoice Fraud**: Placed orders containing negative pricing parameters or negative delivery sums.
8. **Shadow Order Entry**: Attacker submitting order elements with custom unverified fields (e.g. `isAdmin: true` injection).
9. **Spamming WhatsApp / Phone**: Injecting malicious unicode script into contact numbers.
10. **Path Variable Toxic Injections**: Creating document IDs containing toxic character queries rather than letters/numbers.
11. **Order Splitting / Query Theft**: Scanning other customers' orders by requesting blanket list scans without specifying credentials or matching tracker phone numbers.
12. **Foreign Invoice Purge**: Attempting to delete a placed transaction order.

## 3. Rules Implementation Plan
We will draft standard rules that block these behaviors by checking exact keys, sizes, and permissions.
