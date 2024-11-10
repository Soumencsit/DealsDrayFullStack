![Screenshot 2024-11-10 232331](https://github.com/user-attachments/assets/7228c834-5407-46f5-9e15-435821270e58)
# Admin Portal Full-Stack Application

This is a full-stack admin portal application built with Node.js and MongoDB, which allows the admin to log in, sign up, and manage employee records. Features include adding, editing, and deleting employee records, as well as video uploads and handling. The backend of this project is built with Express.js, MongoDB, and various npm packages for handling security, file uploads, and email notifications.
## Video Demonstration

I've created a YouTube video that demonstrates how this project works, covering features, setup, and a walkthrough of the admin portal. Watch the video to get a detailed look at the application's functionality and structure.

[![Watch the video](![Screenshot 2024-11-10 232331](https://github.com/user-attachments/assets/b2dc6d49-cb59-491a-b29e-6fc3baeca278)
)](https://youtu.be/Bt0oEUr3VTY)

> **Note**: Click the image or [here](![Screenshot 2024-11-10 232331](https://github.com/user-attachments/assets/72ed7ecb-5a91-436d-8872-6efa76d04ce0)
) to watch the video on YouTube.

## Features

- **User Authentication**: Admin can log in and sign up.
- **Employee Management**: Admin can add, edit, and delete employee information.
- **Video Handling**: Admin can upload video files.
- **Security**: Passwords are hashed using bcrypt for security.
- **Notifications**: Email notifications can be sent using nodemailer.
- **Data Validation**: Validation is handled using `validator`.

## Project Structure


## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcrypt for password hashing, cors for cross-origin requests
- **File Handling**: multer for image upload management
- **Email Notifications**: nodemailer
- **Environment Variables**: dotenv for environment configurations

## Packages Used

The following packages are used in the project:

- `express`: A minimal and flexible Node.js web application framework.
- `mongoose`: An ODM for MongoDB to model data.
- `bcrypt`: For password hashing to ensure secure user authentication.
- `cors`: A package to enable Cross-Origin Resource Sharing.
- `dotenv`: Loads environment variables from a `.env` file.
- `multer`: For handling `multipart/form-data` which is primarily used for file uploads.
- `nodemailer`: To send emails for notifications or alerts.
- `axios`: To make HTTP requests.
- `path`: Utility to work with file and directory paths.
- `validator`: For data validation.

## Setup and Installation

1. **Clone the Repository**

    ```bash
    git clone <your-repo-url>
    cd your-repo-name
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add the following variables:

    ```plaintext
    PORT=5000
    MONGO_URI=your_mongo_database_url
    JWT_SECRET=your_jwt_secret_key
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    ```

4. **Run the Server**

    ```bash
    npm start
    ```

   The server should now be running on `http://localhost:5000`.

## API Endpoints

### Authentication

- **POST** `/api/auth/signup`: Register a new admin user
- **POST** `/api/auth/login`: Login an admin user and get a token

### Employee Management

- **POST** `/api/employees`: Add a new employee (Admin only)
- **PUT** `/api/employees/:id`: Update employee information (Admin only)
- **DELETE** `/api/employees/:id`: Remove an employee (Admin only)

### Video Handling

- **POST** `/api/upload`: Upload a video file for employee records or other purposes

## Usage

1. **Sign Up and Login**: Admin can sign up with a secure password that will be hashed and stored in MongoDB. Once signed up, they can log in to access the portal.
2. **Manage Employees**: After logging in, the admin can add new employees, update existing ones, or remove employees from the portal.


### Login Page
![Login]![Screenshot 2024-11-10 232331](https://github.com/user-attachments/assets/d2b4df95-fdb7-47cd-898b-7eb31271478c)


### Dashboard
![Dashboard]![Screenshot 2024-11-10 232435](https://github.com/user-attachments/assets/dcaf463e-200d-429f-9503-98f648f91b3e)


## License

This project is licensed under the ISC License.

