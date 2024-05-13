
from django.contrib import admin
from django.urls import path , include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('' , include('myapp.urls')) , #whenever the user inters the home page it sends them to the myapp\urls.py and it take care of the rest 
    path('accounts/', include('django.contrib.auth.urls')),  # Login and logout
    path('api/', include('myapp.urls')),
    # ^ adds URLs for login and logout by including Django's built-in authentication URLs under the /accounts/ path. 
]
