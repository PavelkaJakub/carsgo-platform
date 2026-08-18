# Carsgo v1.0 smoke test

1. Homepage loads and active DB vehicles are visible.
2. Marketplace filters return only matching active vehicles.
3. AI search parses Czech natural-language constraints and ranks real DB vehicles.
4. Vehicle detail shows price history and Carsgo Score.
5. Anonymous visitor can submit a lead; repeated abuse gets HTTP 429.
6. User can register, log in, verify email, reset password and edit profile.
7. User can favorite a vehicle and save a search.
8. Private listing enters PENDING_REVIEW and is not public.
9. Admin can approve it; approved listing becomes public.
10. Partner sees leads and inventory belonging to its company only.
11. XML import rejects non-HTTPS/non-allowlisted feed hosts.
12. Upload presign rejects unsupported MIME types.
13. Stripe subscription checkout creates a session when configured.
14. Stripe webhook rejects invalid signatures.
15. Paid promotion sets featuredUntil after valid completed checkout event.
16. /api/health returns database status.
17. /robots.txt and /sitemap.xml render.
18. Cookie consent banner appears for a new browser.
