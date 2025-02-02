# What is it ⁉

# Address Verification Service (AVS)

## Definition  
The Address Verification Service (AVS) is a security measure used primarily in credit card processing to help detect and prevent fraudulent transactions. It verifies that the billing address provided by a customer during a transaction matches the address on file with the issuing bank.

## How AVS Works
1. **Transaction Initiation**: When a customer makes a purchase online, they enter their billing address as part of the payment process.
2. **Address Comparison**: The payment processor sends this billing address to the cardholder's issuing bank for verification.
3. **Response Code**: The issuing bank checks the provided address against its records and returns an AVS response code to the merchant, indicating whether the addresses match fully, partially, or do not match at all.

## AVS Response Codes
The response codes help merchants determine how to proceed with the transaction:
- **A**: Street address matches, ZIP does not.
- **B**: Street address matches, but ZIP not verified.
- **C**: Street address and ZIP not verified.
- Other codes may indicate different levels of verification based on the card network (Visa, MasterCard, etc.).

## Importance of AVS
- **Fraud Prevention**: AVS is particularly useful for card-not-present (CNP) transactions, such as online purchases, where the risk of fraud is higher. By verifying addresses, merchants can reduce chargebacks and fraudulent activities.
- **Limitations**: While AVS enhances security, it is not foolproof. Legitimate customers may sometimes have mismatched addresses due to recent moves or errors in bank records, which could lead to declined transactions.

## Use Cases
AVS is widely utilized by e-commerce businesses and financial institutions in countries like the United States, Canada, and the United Kingdom as part of a broader fraud prevention strategy.
