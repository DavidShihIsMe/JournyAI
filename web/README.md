# Journy — Web Application

Next.js web application for the Journy travel personality platform.

## Development

```bash
npm install
cp .env.example .env.local   # Add OPENAI_API_KEY (and optional GOOGLE_MAPS_API_KEY)
npm run dev                  # http://localhost:3000
```

## Deployment

This project deploys automatically via Vercel.

### First-time setup:
1. Push this repo to GitHub
2. Go to vercel.com and sign in with GitHub
3. Click "Add New Project" and select this repo
4. Set Root Directory to `web`
5. Add environment variables (at minimum `OPENAI_API_KEY`; optional `OPENAI_MODEL`, `GOOGLE_MAPS_API_KEY`)
6. Click Deploy
7. After deployment, go to Settings > Domains
8. Add your custom domain
9. Update DNS records at your domain registrar:
   - A record: `76.76.21.21`
   - CNAME record: `cname.vercel-dns.com`

### After setup:
Every push to the main branch auto-deploys.
Preview deployments are created for pull requests.

### Health check:
Visit `/api/health` to verify the deployment is running.
