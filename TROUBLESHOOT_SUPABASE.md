# Supabase Connection Troubleshooting

## Current Issue
Getting SCRAM authentication error: "SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing"

## Possible Causes & Solutions

### 1. Incorrect Connection String Format
Your current DATABASE_URL appears to have formatting issues. Let's verify the correct format:

**Correct Supabase Connection String Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Common Issues:**
- Extra characters or symbols in the password
- Wrong host format (should be `db.[ref].supabase.co`, not pooler)
- Missing or incorrect port (should be 5432 for direct connection)

### 2. Try Direct Connection Instead of Pooler
Instead of the "Transaction pooler" connection string, try:
1. In Supabase dashboard → Settings → Database
2. Look for "Connection string" under "Connection info"
3. Use the **Direct connection** string instead of pooler

### 3. Alternative: Session Mode
If direct connection doesn't work, try Session mode:
1. In Supabase → Settings → Database → Connection pooling
2. Use **Session** mode instead of **Transaction** mode
3. Copy that connection string

### 4. Check Password Encoding
- Ensure your password doesn't contain special characters that need URL encoding
- Characters like `@`, `#`, `%`, etc. need to be encoded
- Try creating a simpler password (letters and numbers only) for testing

## Next Steps
Please try getting a new connection string using the **Direct connection** method and update your Replit secret with the new format.