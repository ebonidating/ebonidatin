# 📋 SUPABASE DATABASE SETUP INSTRUCTIONS

## 🎯 How to Set Up Your Eboni Dating Database

Follow these steps to complete your database setup and fix all issues:

---

## STEP 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Login with your credentials
3. Select your project: **aqxnvdpbyfpwfqrsorer**

---

## STEP 2: Run the Complete Database Setup Script

### Option A: Using SQL Editor (RECOMMENDED)

1. In Supabase Dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the entire content from:
   ```
   scripts/complete-database-setup.sql
   ```
4. Click **Run** or press `Ctrl+Enter`
5. Wait for completion (should take 5-10 seconds)
6. Check the results tab for confirmation messages

### Option B: Using Supabase CLI

```bash
cd /data/data/com.termux/files/home/ebonidatin
supabase db reset
```

---

## STEP 3: Verify Database Setup

After running the script, you should see:

```
✅ Database setup and update completed successfully!
All tables created, RLS enabled, sample data inserted
Your Eboni Dating database is ready!
```

### Check These Stats:

- **Tables Created**: 7 (profiles, matches, messages, likes, notifications, faqs, success_stories)
- **RLS Enabled**: Yes on all tables
- **FAQ Entries**: 9
- **Success Stories**: 3

---

## STEP 4: What the Script Does

### Creates Tables:
✅ `profiles` - User profiles with all fields
✅ `matches` - User matches with compatibility scores
✅ `messages` - Chat messages between users
✅ `likes` - User likes and super likes
✅ `notifications` - System notifications
✅ `faqs` - Frequently asked questions
✅ `success_stories` - Couple success stories

### Sets Up Security:
✅ Row Level Security (RLS) enabled
✅ Proper RLS policies for data access
✅ Auth triggers for new user signup
✅ Update triggers for timestamps

### Adds Sample Data:
✅ 9 FAQ entries
✅ 3 Success stories
✅ All properly categorized

### Creates Indexes:
✅ Performance indexes on all tables
✅ Optimized for common queries

---

## STEP 5: Test the Database

### Using the Update Script:

```bash
cd /data/data/com.termux/files/home/ebonidatin
node scripts/update-supabase.mjs
```

You should see:
```
🚀 Starting Supabase Database Update Script
✅ Connected to Supabase successfully!
📊 Total profiles: X
✅ Database update completed successfully!
```

---

## STEP 6: Verify Tables in Supabase

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - profiles
   - matches
   - messages
   - likes
   - notifications
   - faqs
   - success_stories

3. Click on **faqs** table - should have 9 entries
4. Click on **success_stories** table - should have 3 entries

---

## 🔧 TROUBLESHOOTING

### Issue: "Table already exists"
**Solution**: This is normal - the script uses `IF NOT EXISTS`

### Issue: "Permission denied"
**Solution**: Make sure you're using the service role key in .env.local

### Issue: "Function already exists"
**Solution**: This is normal - the script uses `CREATE OR REPLACE`

### Issue: Cannot connect to database
**Solution**: 
1. Check your internet connection
2. Verify credentials in .env.local
3. Make sure Supabase project is active

---

## 📊 EXPECTED DATABASE STATE

After successful setup:

### Tables:
- ✅ All 7 core tables created
- ✅ All indexes created
- ✅ All constraints applied

### Security:
- ✅ RLS enabled on all tables
- ✅ Policies created and active
- ✅ Auth triggers working

### Data:
- ✅ FAQs populated
- ✅ Success stories added
- ✅ Ready for user signups

---

## 🚀 NEXT STEPS AFTER DATABASE SETUP

1. **Test User Signup**
   - Go to your site
   - Try creating an account
   - Profile should be auto-created

2. **Test FAQ Page**
   - Visit `/faq`
   - Should display all questions

3. **Test Success Stories**
   - Visit `/success-stories`
   - Should display 3 stories

4. **Deploy to Production**
   ```bash
   git add .
   git commit -m "Complete database setup and new pages"
   git push origin main
   ```

---

## 📝 FILES CREATED FOR DATABASE MANAGEMENT

1. **scripts/complete-database-setup.sql**
   - Complete database schema
   - RLS policies
   - Sample data
   - Run this in Supabase SQL Editor

2. **scripts/update-supabase.mjs**
   - Node.js script to test connection
   - Update existing data
   - Fetch statistics
   - Run with: `node scripts/update-supabase.mjs`

3. **scripts/fix-database-issues.sql**
   - Quick fixes for common issues
   - Data cleanup
   - Validation queries

---

## ✅ SUCCESS INDICATORS

You'll know everything is working when:

1. ✅ No errors in Supabase SQL Editor
2. ✅ All tables visible in Table Editor
3. ✅ FAQs and Success Stories populated
4. ✅ User signup creates profile automatically
5. ✅ update-supabase.mjs runs without errors
6. ✅ Website loads without database errors

---

## 🆘 NEED HELP?

If you encounter issues:

1. Check Supabase logs in Dashboard
2. Review error messages carefully
3. Verify .env.local credentials
4. Ensure internet connection is stable
5. Try running scripts again (they're idempotent)

---

## 🎉 YOU'RE DONE!

Once you see success messages, your database is fully configured and ready for production!

