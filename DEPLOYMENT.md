# Pinga Frontend Deployment

Use Vercel for the Next.js app.

Create a new Vercel project from:

```text
https://github.com/AbdulmalikAbdulwakeel1/Pinga-frontend
```

Use these settings:

```text
Framework preset: Next.js
Build command: npm run build
Install command: npm install
Output directory: .next
```

Required environment variables:

```text
NEXT_PUBLIC_API_URL=https://<render-backend-url>/api/v1
NEXT_PUBLIC_MOCK_MODE=false
```

Optional environment variables:

```text
NEXT_PUBLIC_META_APP_ID=
```

After Render gives you the backend URL, update `NEXT_PUBLIC_API_URL` in Vercel and redeploy.
