# Deploy KeyMatch to DigitalOcean

## Option 1: DigitalOcean App Platform (Recommended - Easiest)

### Steps:

1. **Push to GitHub** (Already done!)

2. **Create App on DigitalOcean App Platform**
   - Go to https://cloud.digitalocean.com/apps
   - Click "Create App"
   - Choose "GitHub" as source
   - Select your `kentin0-fiz0l/KeyMatch` repository
   - Branch: `main`
   - Source Directory: `/`
   - Auto-deploy: Enable

3. **Configure Build Settings**
   - Build Command: `npm install`
   - Run Command: `npm start`

4. **Set Environment Variables**
   - Add your environment variables from `.env.example`
   - Critical ones:
     - `NODE_ENV=production`
     - `ZAPIER_WEBHOOK_URL=your_webhook`

5. **Deploy**
   - Choose the $5/month Basic plan to start
   - Click "Launch Basic App"

6. **Domain Setup**
   - Add your custom domain in App Settings
   - Update DNS records to point to DigitalOcean

---

## Option 2: DigitalOcean Droplet (More Control)

### Create Droplet:
```bash
# 1. Create Ubuntu 22.04 droplet ($6/month)
# 2. SSH into droplet
ssh root@your_droplet_ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install PM2 (process manager)
npm install -g pm2

# 5. Clone repository
git clone https://github.com/kentin0-fiz0l/KeyMatch.git
cd KeyMatch

# 6. Install dependencies
npm install

# 7. Create .env file
cp .env.example .env
nano .env  # Edit with your values

# 8. Start with PM2
pm2 start server.js --name keymatch
pm2 save
pm2 startup

# 9. Install Nginx
sudo apt install nginx

# 10. Configure Nginx
sudo nano /etc/nginx/sites-available/keymatch
```

### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name keymatch.com www.keymatch.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/keymatch /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

### SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d keymatch.com -d www.keymatch.com
```

---

## Quick Start Commands

### For DigitalOcean CLI (doctl):
```bash
# Install doctl
brew install doctl

# Authenticate
doctl auth init

# Create app from CLI
doctl apps create --spec .do/app.yaml
```

### Monitor Your App:
```bash
# View logs
doctl apps logs YOUR_APP_ID

# Get app info
doctl apps get YOUR_APP_ID
```

---

## Post-Deployment Checklist

- [ ] Test lead form submission
- [ ] Verify Zapier webhook receives data
- [ ] Check email delivery (if using SendGrid)
- [ ] Set up domain DNS
- [ ] Enable SSL certificate
- [ ] Test on mobile devices
- [ ] Set up monitoring (UptimeRobot)
- [ ] Configure backups

---

## Estimated Costs

- **App Platform**: $5-12/month
- **Droplet**: $6-12/month
- **Domain**: $15/year
- **Total**: ~$10/month to start