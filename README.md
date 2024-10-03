# ServiExpress

ServiExpress is a web-based marketplace that connects independent contractors (handymen, service providers) with customers in Rivas. It allows users to create accounts, browse services, make real-time bookings, and leave feedback. The platform offers features such as secure authentication, personalized recommendations, and multi-language support. It aims to make finding and booking reliable service providers easy and convenient.

## Features

- **User Authentication**: Secure authentication using email, password, and activation codes for user account validation.
- **Service Listings**: Browse services provided by independent contractors.
- **Real-Time Booking**: Book services in real-time with immediate confirmation.
- **User Ratings & Reviews**: Customers can rate and review services received.
- **Notifications**: Receive real-time notifications for bookings, reviews, and more.
- **Service Provider Analytics**: Contractors can view detailed analytics about their performance and service bookings.
- **Multi-language Support**: The platform supports Spanish and English.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/) (v16.x or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (or any MongoDB instance)
- [SendGrid](https://sendgrid.com/) account for email service

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ODominguez777/serviexpress-backend.git
   cd serviexpress-backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create an .env file at the root directory and add the following configuration:

# Database Configuration

- MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority

# SendGrid Configuration

- SENDGRID_API_KEY='your-sendgrid-api-key'
- SENDGRID_FROM_EMAIL='your-email@example.com'

# Server Configuration

- PORT=3000

# Compile and Run The Project

# development

```bash
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Api Endpoints

The main API endpoints for user registration, login, and service management are documented through Swagger. Once the application is running, you can access the API documentation by visiting:

- http://localhost:3000/api

# Licence
This project is licensed under the MIT License - see the LICENSE file for details.

