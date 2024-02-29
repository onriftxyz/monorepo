1. how is onboarding going to work?
2. what do we store on the db?
3. how is it going to look on the frontend?

---

onboarding flow:

1. user comes to login page, where they sign in with email otp / social oauth
2. taken to onboarding page if new user ( or can go to settings to add their wallet )
3. in onboarding page, allow them to enter more information ( name, about etc ), AND allow them to optionally connect their wallet OR OR OR allow US to provision them with an embedded wallet to receive funds and send out NFTs etc

---

- match ui with design
- setup hooks for email auth
- setup hooks for wallet auth during onboard
- setup onboarding data input
- save all this to db
