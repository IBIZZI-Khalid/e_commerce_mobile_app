from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (   
    ProductViewSet ,
    CategoryViewSet , 
    OrderViewSet  , 
    OrderItemViewSet , 
    UserProfileViewSet, 
    profile ,home ,
    list_mongo_products, 
    add_mongo_product ,
    LoginView,
    SignupView,
    ChangePasswordView,
    UpdateUsernameView,
    )
from django.contrib.auth import views as auth_views
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'orderitems', OrderItemViewSet)
router.register(r'userprofiles', UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),  # All API endpoints
    path('mongo-products/', list_mongo_products, name='list_mongo_products'),
    path('add-mongo-product/', add_mongo_product, name='add_mongo_product'),

    path('login/', LoginView.as_view(), name='login'),
    path('register/', SignupView.as_view(), name='register'),  
    path('profile/', profile, name='profile'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('update-username/',UpdateUsernameView.as_view(),name='update-username' ),
    path('update-password/', ChangePasswordView.as_view(), name='update-password'),
    

    # path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('accounts/profile/', profile, name='profile'),
    # path('login/', CustomLoginView.as_view(), name='login'),    
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),   
    # path('accounts/', include('django.contrib.auth.urls')),  
    path('home/', home, name='home'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),

]

