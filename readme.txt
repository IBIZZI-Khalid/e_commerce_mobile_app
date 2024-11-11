#Product Comparison Mobile App
This project is a mobile application built with React Native for the front end and Django + MongoDB for the back end. The app compares products across different platforms, allowing users to view the best options in one place. Currently, data is added manually, but the goal is to integrate reverse-engineering methods to retrieve this information dynamically from other app servers.

##Getting Started
###Frontend
Navigate to the frontend directory:
C:\.....\mobile_app_store\appstore

Start the frontend with Expo:
npx expo start

Clear app cache (if needed):
expo r -c

###Backend
Navigate to the backend directory:
C:\.....\mobile_app_store\django_backend

Start the Django server:
python manage.py runserver 0.0.0.0:8000

Important Setup Notes
Install Dependencies: Make sure all required libraries and frameworks are installed before running the app.

Network Configuration:
Update the IPv4 address every time you connect to a new WiFi network.
Disable the firewall for the WiFi connection if necessary.
CSRF Protection:
Either disable CSRF protection (not recommended for production) or include a CSRF token in your Axios requests to the backend.
