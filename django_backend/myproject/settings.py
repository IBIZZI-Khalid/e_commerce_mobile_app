 
from pathlib import Path
import django
import os
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent
LOGIN_REDIRECT_URL = '/home/'
SECRET_KEY = 'django-insecure-w&jx%jec49%hj=_dokd!o875vwx500m#tvqd1f83xob^uf1ts$'
DEBUG = True

ALLOWED_HOSTS = [   'localhost',
                    '192.168.11.112',
                    '192.168.100.105',
                    '127.0.0.1',
                    '192.168.11.168',
                    '192.168.100.109',
                    '192.168.0.100',
                    '192.168.254.213',
                    '192.168.11.241',
                    '192.168.100.150',
                    '192.168.100.109'
                ]
CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:8000",  
    "http://0.0.0.0:8081",
    'http://192.168.11.168:8081',
    'http://192.168.11.168:8000',
    'http://192.168.0.100:8081',
    "http://192.168.0.100", 
    'http://192.168.254.213',
    "http://192.168.11.241:8081",
    "http://192.168.11.241",
    'htpp://192.168.100.109:8081',
    "http://192.168.100.109",

]
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
'accept',
'accept-encoding',
'authorization',
'content-type',
'dnt',
'origin',
'user-agent',
'x-csrftoken',
'x-requested-with',
]
CORS_ALLOW_METHODS = [
'DELETE',
'GET',
'OPTIONS',
'PATCH',
'POST',
'PUT',
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8081',
    'http://127.0.0.1:8081',
]

MONGODB_DATABASE = {
    'name': 'products_databse',        
    'host': 'localhost',        
    'port': 27017,  
    'database': 'products_database',
    'product_collection': 'product_collection',
    'username': None,    
    'password': None,    
    }
# Application definition
INSTALLED_APPS = [
    'corsheaders',
    'django',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'myproject',
    'rest_framework',
    'rest_framework_simplejwt',
    'myapp.apps.MyappConfig',

]



REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}



MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
      
]

ROOT_URLCONF = 'myproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS':  [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'myproject.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'products_database',
        'ENFORCE_SCHEMA' : False,
        'CLIENT': {
            'host': 'localhost',
            'port': 27017,
            'username': None,
            'password': None,
        },
       
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True



STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


from django.contrib.messages import constants as messages
MESSAGE_TAGS = {
    messages.DEBUG: 'debug',
    messages.INFO: 'info',
    messages.SUCCESS: 'success',
    messages.WARNING: 'warning',
    messages.ERROR: 'error',
}
