# VendorConnect - B2B Platform

A comprehensive B2B platform connecting street vendors with suppliers, featuring group buying, order management, and delivery tracking.

## 🚀 Features

- **Multi-User Platform**: Support for vendors and suppliers
- **Group Buying**: Vendors can join group orders for better pricing
- **Order Management**: Complete order lifecycle management
- **Delivery Tracking**: Real-time delivery status updates
- **Product Management**: Supplier product catalog management
- **Authentication**: Secure user authentication and authorization
- **Responsive Design**: Modern, mobile-friendly interface

## 🏗️ Architecture

- **Frontend**: React.js with Bootstrap for UI
- **Backend**: Node.js with Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT tokens with Firebase integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd VendorConnect
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE b2b_vendor_platform;
```

#### Import Database Schema
```bash
mysql -u root -p b2b_vendor_platform < MySQL/b2b.sql
```

### 4. Environment Configuration

#### Backend Configuration
Copy the environment example file and configure your settings:
```bash
cd b2b-backend
cp env.example .env
```

Edit `.env` file with your database credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=b2b_vendor_platform

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

#### Frontend Configuration
```bash
cd Frontend
cp env.example .env
```

Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Initialize Database
```bash
npm run setup-db
npm run import-data
```

### 6. Start the Application

#### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000

## 📁 Project Structure

```
VendorConnect/
├── b2b-backend/          # Backend API server
│   ├── config/           # Database and Firebase config
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── scripts/          # Database scripts
│   └── app.js           # Main server file
├── Frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   └── App.js       # Main app component
│   └── public/          # Static files
├── MySQL/               # Database schema and data
└── package.json         # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/vendor/auth/login` - Vendor login
- `POST /api/vendor/auth/register` - Vendor registration

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order

### Group Orders
- `GET /api/group-orders` - Get all group orders
- `POST /api/group-orders` - Create group order
- `GET /api/vendor/group-orders` - Get vendor group orders
- `POST /api/vendor/group-orders/:id/join` - Join group order

## 👥 User Types

### Vendor
- Browse available products
- Join group orders for better pricing
- Track order status and delivery
- Manage personal orders

### Supplier
- List and manage products
- Respond to group order requests
- Manage inventory and pricing
- Track order fulfillment

## 🚀 Development

### Running in Development Mode
```bash
# Terminal 1 - Backend
cd b2b-backend
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm start
```

### Database Management
```bash
# Initialize database
npm run setup-db

# Import sample data
npm run import-data
```

## 🧪 Testing

```bash
# Test backend
cd b2b-backend
npm test

# Test frontend
cd Frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set environment variables for production
2. Build the application: `npm run build`
3. Deploy to your preferred hosting service

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Note**: Make sure to update the Firebase configuration and other sensitive information in the environment files before deploying to production.

