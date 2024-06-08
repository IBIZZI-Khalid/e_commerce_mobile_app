to run the frontend part of the app  we gotta navigate to the fe directory (C:\Users\hp\Desktop\mobile_app_store\appstore) and run : 
npx expo start 

to clear app cash
expo r -c 

to run the backend backend part of the app  we gotta navigate to the be directory (C:\Users\hp\Desktop\mobile_app_store\django_backend) and run : 
python manage.py runserver 0.0.0.0:8000

make sure u installed all the libs and frameworks needed to run the app
each time u connect to the wifi change the ipv4 + deactivate the firwall for the wifi

gotta  either disable CSRF protection (not recommended for production) or include the CSRF token in your axios request./django_backend

