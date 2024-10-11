# NestFile
NestFile is a powerful and flexible file management system that enables users to create, organize, and manage files and directories. With features such as nested directory creation, file uploads, and seamless navigation, NestFile offers an intuitive user experience. Built with a Django REST Framework backend and a React frontend, the project showcases the integration of modern web technologies.

## Features

- **Create and Manage Nested Directories**:Organize your files within a hierarchical directory structure.
- **File Operations**: Upload, rename, and delete files .
- **Visual Navigation:**: User interface that displays directories and files with icons for easy identification.
- **RESTful API:*: Built using Django REST Framework, the API supports CRUD operations for directories and files.

##  Project Architecture
The backend is built using Django and the Django REST Framework to handle the API endpoints. The frontend uses React with TailwindCSS for a modern, responsive UI.

## Backend Structure:

- **Django Models**:  Defines the directory and file structure, enabling recursive relationships and organized storage.
- **Serializers**: Converts Django models to JSON and vice versa.
- **ViewSets and Routes**: Manages CRUD operations and custom actions for directories and files.


## Frontend Structure:

- **React Components**: Handles file uploads, directory navigation, and file operations.
- **State Management**: Manages application state using React hooks and context.
- **TailwindCSS Styling**: Provides a clean and consistent design across the application.

  # Steps to Implement the Backend

## 🛠️ Setup and Installation
### Step 1: Clone the Repository
git clone https://github.com/RickMuchira/NestFile.git

### Step 2: Create and Activate Virtual Environment
# On Windows use
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
# On linux use
python3 -m venv env
  source venv/bin/activate

### Step 3: Create a Django Project and App
Start by creating a new Django project and a new app for file management:
# Install requirements
- sudo apt install python3-django
- pip install django psycopg2-binary django-leaflet djangorestframework
# Create a Django project
django-admin startproject file_management_system

# Navigate to the project folder
cd file_management_system

# Create a new app for file and directory management
python manage.py startapp file_management

Now, add the new app and rest_framework to the INSTALLED_APPS in settings.py:
# file_management_system/settings.py

INSTALLED_APPS = [
    # Django default apps...
    'rest_framework',
    'file_management',  # Your app for managing files and directories
]

### Step 4. File Storage with Django's File Handling
Django uses the FileField in models to manage files. When a file is uploaded, Django needs to know where to store it, so we define two settings in settings.py

# file_management_system/settings.py
MEDIA_URL = '/media/'  # URL prefix for accessing uploaded files
MEDIA_ROOT = BASE_DIR / 'media'  # Path to store uploaded files


### 5. Run Django Development Server
#### a. Run Migrations

Before running the server, ensure all the database migrations have been applied. This will create the necessary database tables based on the models you defined.
Run the following commands:
## python manage.py makemigrations
## python manage.py migrate

This ensures your PostgreSQL database is up to date with the current models.

#### b. Run the Development Server
To start the development server, run the following command in your project’s root directory (where manage.py is located):
Run the following commands:
## python manage.py runserver

__Expected Output:__
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
October 08, 2024 - 14:45:09
Django version 3.2, using settings 'file_management_system.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.


  # Steps to Implement the Backend
## Step 1. Set Up a React App
Before setting up a React app, make sure you have Node.js and npm installed. Run the following commands to install them:
 ## sudo apt install nodejs
 ## sudo apt install npm

## Step 2: Navigate to the Root Directory of Your Django Project
You want to set up the React app inside your file_management_system/ directory, as shown in your project structure:
so you have to first navigate to file_management_system/ directory,
__cd ~/NestFile/file_management_system__

## Step 3: Create a New React Application
Use npx (Node Package Executor) to create a new React application inside file_management_system/:

**npx create-react-app nestfile-frontend**

This command will:

Create a new folder named __nestfile-frontend__.
Set up the necessary files and dependencies to get started with a React app.
After the command completes, you will see the following structure inside file_management_system/:
__file_management_system/
├── file_management/
├── manage.py
├── file_management_system/
└── nestfile-frontend/    <-- New React app will be here__

## Step 4: Navigate into the React Application Directory
Move into the newly created React application directory: **cd nestfile-frontend**

## Step 5: Install TailwindCSS and its Dependencies


## Step 5: Start the React Development Server
Now, start the React development server:

__npm start__

The development server will start, and you can access your React app at http://localhost:3000 by default. You should see the default React landing page, indicating that your React application is set up correctly.
## Step 5: Install TailwindCSS and its Dependencies

Navigate to the React Project Directory:

Make sure you're inside the __nestfile-frontend__ directory:







