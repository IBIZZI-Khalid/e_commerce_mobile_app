 
from pathlib import Path
import django
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
LOGIN_REDIRECT_URL = '/home/'


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-w&jx%jec49%hj=_dokd!o875vwx500m#tvqd1f83xob^uf1ts$'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

CORS_ORIGIN_ALLOW_ALL = True

ALLOWED_HOSTS = [   'localhost',
                    '192.168.11.112',
                    '192.168.100.105',
                    '127.0.0.1',
                    '192.168.11.168',
                    '192.168.100.109']
# ALLOWED_HOSTS = ['*']


# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:8081",
#     "http://127.0.0.1:8081",
#     "http://127.0.0.1:8000",  
    
# ]

MONGODB_DATABASE = {
    'name': 'products_databse',        
    'host': 'localhost',        
    'port': 27017,  
    'database': 'products_database',
    'product_collection': 'product_collection',
    'username': None,    
    'password': None,    }


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
    'myapp.apps.MyappConfig',
]

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
# CORS_ORIGIN_WHITELIST = (
#     #'http://localhost:3000',
#     'http://localhost:8081' , 
#     'http://127.0.0.1:8081',
#     'http://192.168.11.112:8081',
    
#     "http://localhost:8081",
#     "http://localhost:19006",
#     "http://localhost:19002",
#     "http://192.168.11.112:19000",

#     #this allows django to accept requests from the app running at port 8081
# )
# realted to connecting django to react native  app ^^

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
        'ENFORCE_SCHEMA' : False, #This line is added to ignore the error of not having a schema in MongoDB database
        'CLIENT': {
            'host': 'localhost',
            'port': 27017,
            'username': None,
            'password': None,
            # 'authSource': 'admin',
            # 'authMechanism': 'SCRAM-SHA-1'
        },
       
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


from django.contrib.messages import constants as messages
MESSAGE_TAGS = {
    messages.DEBUG: 'debug',
    messages.INFO: 'info',
    messages.SUCCESS: 'success',
    messages.WARNING: 'warning',
    messages.ERROR: 'error',
}
