# 🚀 Quick Start Guide

Get VendorConnect up and running in 5 minutes!

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## ⚡ Quick Setup

### 1. Clone and Setup
```bash
git clone <repository-url>
cd VendorConnect
npm run setup
```

### 2. Configure Database
```sql
CREATE DATABASE b2b_vendor_platform;
```

### 3. Configure Environment
Edit the environment files with your settings:

**Backend** (`b2b-backend/.env`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=b2b_vendor_platform
JWT_SECRET=your_secret_key
```

**Frontend** (`Frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Initialize Database
```bash
npm run setup-db
```

### 5. Start Application
```bash
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🧪 Test Connection

To verify everything is working:
```bash
npm run test-connection
```

## 📱 Sample Users

After setup, you can login with these sample accounts:

**Vendor:**
- Name: John Vendor
- Phone: +1234567890
- Role: vendor

**Supplier:**
- Name: Sarah Supplier
- Phone: +1987654321
- Role: supplier

## 🆘 Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running
2. Verify database credentials in `b2b-backend/.env`
3. Check if database exists: `SHOW DATABASES;`

### Port Conflicts
- Backend runs on port 5000
- Frontend runs on port 3000
- Change ports in environment files if needed

### Dependencies Issues
```bash
npm run install-all
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints at http://localhost:5000
- Check out the component structure in `Frontend/src/components/`

---

**Need help?** Check the main README.md or open an issue in the repository. 