
# Clinic Management System - README

## Project Description

This project was developed as part of the "Rapid App Development Tools" course in university. The Clinic Management System allows for managing doctor appointments with roles divided into administrator, doctor, and patient. The application was implemented twice: initially in ASP.NET and subsequently rewritten using FastAPI and React.

## Technologies

1. **ASP.NET**
2. **FastAPI**
3. **React**

## Features

### General
- User login and registration
- User session management
- System protection against database access concurrency issues

### Administrator Role
- Adding, editing, and deleting users (doctors, patients)
- Managing doctors' schedules
- Viewing visit reports

### Doctor Role
- Viewing and managing own schedule
- Viewing patients' visit history
- Adding medical notes to visits

### Patient Role
- Registering for appointments
- Viewing personal visit history
- Editing personal information

## Installation

### Prerequisites
- [.NET Core SDK](https://dotnet.microsoft.com/download) (for ASP.NET version)
- [Python](https://www.python.org/downloads/) (for FastAPI version)
- [Node.js](https://nodejs.org/en/download/) (for React frontend)
- A database system (e.g., PostgreSQL, MySQL)

### Setup for FastAPI and React Version

#### Backend (FastAPI)
1. Clone the repository:
    ```sh
    git clone https://github.com/FilipBudzynski/clinic-management-system.git
    ```
2. Navigate to the project directory:
    ```sh
    cd clinic-management-system
    ```
3. Create a virtual environment and activate it:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
4. Install the required packages:
    ```sh
    cd FastApi
    pip install -r requirements.txt
    ```
5. Set up the database connection.
    In FastApi direcotry create **.env** file and add:
    ```sh
    SECRET_KEY=<your secret key for JWT authorization>
    ALGORITHM=HS256
    URL_DATABASE=<your database URL>
    ```
    
6. Run the application:
    ```sh
    uvicorn main:app --reload
    ```

#### Frontend (React)
Application uses **static files** build from the React part of the project.
Therefore there is no need to run Frontend seperatly from the Backend.
Although if you want to run the frontend seperatly:

1. Navigate to the frontend directory:
    ```sh
    cd React/clinic-app
    ```
2. Install the required packages:
    ```sh
    npm install
    ```
3. Run the application:
    ```sh
    npm start
    ```

## Usage

### Administrator
- Log in to the system using administrator credentials (admin, admin).
- Manage users and doctors' schedules through the admin dashboard.

### Doctor
- Log in using doctor credentials.
- View and manage your schedule and patient visit history.

### Patient
- Register or log in to the system.
- Schedule appointments and view your visit history.

## Screen Shots
![Login Page](/screen_shots/scr1.png)
![User Visits](/screen_shots/scr2.png)
![Admin Add User](/screen_shots/scr3.png)
![Profile Page](/screen_shots/scr4.png)

## Contributing
Contributions are welcome. Please fork the repository and create a pull request with your changes.


## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
