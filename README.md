# VendorConnect Backend Update

A B2B platform that connects street vendors directly to farmers/wholesalers, with built-in group buying and shared logistics features.

## Core Features

1. **Direct Supplier Connection**: Eliminates middlemen by connecting vendors directly to farmers and wholesalers.
2. **Bulk Buying**: Allows vendors to pool orders for better prices.
3. **Hyperlocal Supplier Discovery**: Find suppliers in your area.
4. **Transport Pooling**: Share delivery costs with other vendors.

## Technologies Used

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/VendorConnect.git
   cd VendorConnect/b2b-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=b2b_vendor_platform
   DB_PORT=3306

   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=24h

   PORT=3000
   ```

4. Import the vendor database:
   ```
   npm run import-data
   ```
   This will create the database and import data from the CSV files in the Vendor folder.

5. Start the server:
   ```
   npm run dev
   ```

The server will start on port 3000 by default. You can access the API at `http://localhost:3000`.

