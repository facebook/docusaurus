[[module Plutus.V1.Ledger.Tx]]

```haskell
-- | Address with two kinds of credentials, normal and staking.
data Address = Address{ addressCredential :: Credential, addressStakingCredential :: Maybe StakingCredential }
    deriving stock (Eq, Ord, Show, Generic)
    deriving anyclass (NFData)
```

---

# 📘 Tutorial: Understanding the `Address` Type in Plutus

## 🔍 Introduction

In Cardano's Plutus smart contract language, an `Address` plays a crucial role in defining where assets can be sent or locked. Unlike traditional blockchain addresses, a Plutus `Address` may contain two types of credentials: a **payment credential** (mandatory) and an optional **staking credential**. In this tutorial, we will explore the structure and purpose of the `Address` data type as defined in Plutus.

---

## 🧱 The Plutus Code

```haskell
-- | Address with two kinds of credentials, normal and staking.
data Address = Address
  { addressCredential        :: Credential
  , addressStakingCredential :: Maybe StakingCredential
  }
  deriving stock (Eq, Ord, Show, Generic)
  deriving anyclass (NFData)
```

---

## 📥 Inputs, Variables, and Outputs

Since this is a **data type definition**, it does not behave like a function, so it doesn't have typical "inputs" and "outputs". Instead, it defines a **structure** used throughout Cardano transactions.

### 🔸 Fields (Variables)

- `addressCredential :: Credential`
    
    - This is the **main (normal) credential**, which can be a public key or a script hash that controls the address.
        
- `addressStakingCredential :: Maybe StakingCredential`
    
    - This is an **optional staking credential** used to associate the address with a staking reward account.
        
    - It uses `Maybe`, so it can either contain a staking credential (`Just cred`) or none (`Nothing`).
        

---

## 🧠 Explanation in Simple Terms

This data type defines what a Cardano address looks like on-chain in Plutus:

- Every address has a **credential** that tells who owns or controls it.
    
- Optionally, it might also contain a **staking credential** to allow staking rewards.
    

Think of it like:

```json
{
  "payment": "who controls the funds",
  "staking": "who earns staking rewards (optional)"
}
```

---

## 💡 Plutus Example

Here’s how you might construct an address using this type:

```haskell
-- Suppose we have a payment key hash and staking key hash
let paymentCred = PubKeyCredential somePubKeyHash
let stakingCred = Just (StakingHash (PubKeyCredential someStakingKeyHash))

-- Construct the address
let addr = Address paymentCred stakingCred
```

Or, if there is no staking credential:

```haskell
let addr = Address paymentCred Nothing
```

---

## 🖼️ Illustration (Cardano Context)

```
┌───────────────────────────┐
│        Address            │
│ ┌───────────────────────┐ │
│ │ addressCredential     │◄─ Public Key or Script Hash (Required)
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ addressStakingCredential │◄─ Staking Key (Optional)
│ └───────────────────────┘ │
└───────────────────────────┘
```

🔵 _Both of these components work together to secure assets and participate in staking on the Cardano blockchain._

---

## 🔚 Conclusion

The `Address` type in Plutus is a foundational structure that models the way Cardano handles ownership and staking at a low level. Understanding how this type works is essential when writing smart contracts that interact with on-chain addresses. It provides flexibility for both custodial and stake-aware addresses, reinforcing Cardano’s design principles.

---
