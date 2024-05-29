from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from .mongo_utils import get_mongo_connection  # Import the MongoDB utility
from rest_framework import serializers
from django.http import HttpResponse

from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import UserRegisterForm 

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from rest_framework import status

from rest_framework import viewsets
from .models import Product, Category, Order, OrderItem, UserProfile
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, OrderItemSerializer, UserProfileSerializer ,CartSerializer
import logging

from django.contrib.auth.decorators import login_required

from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import update_session_auth_hash
from django.http import JsonResponse
import json
from django.http import JsonResponse

from .models import Cart



from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from .mongo_utils import get_mongo_connection  # Import the MongoDB utility


from django.shortcuts import render, redirect
from django.contrib.auth import login
 
from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.urls import reverse_lazy
  
 
@login_required
def home(request):
    return render(request, 'home.html')

@login_required
def profile(request):
    return render(request, 'profile.html')

@api_view(['GET'])
def list_mongo_products(request):
    db = get_mongo_connection()
    products = list(db.product_collection.find({}, {"_id": 1, "name": 1, "description": 1, "price": 1, "image": 1}))  # Exclude _id field
    
    #converting object id to a string 
    for product in products:
        product["_id"] = str(product["_id"])
    return Response({'products_data': products})

@api_view(['POST'])
def add_mongo_product(request):
    try:
        db = get_mongo_connection()
        new_product = request.data
        # Ensure validation and sanitation of input data
        if isinstance(new_product, dict):  # Check if the data is a dictionary
            # Insert the new product into the MongoDB collection
            result = db.product_collection.insert_one(new_product)
            return Response({'_id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        else:
            # Return a response with an appropriate error message if the data is not valid
            return Response({'error': 'Invalid data format'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # Log any exceptions that occur during the insertion process
        logging.error(f"An error occurred while inserting a product into MongoDB: {e}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Viewsets handle the logic of typical API endpoints like listing all instances, retrieving one instance, updating, and deleting.
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Automatically associate order with logged-in user

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

logger = logging.getLogger(__name__)
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """ Ensure users can only see their own profile. """
        user = self.request.user
        logger.debug(f"Authenticated user: {user}")
        user_profiles = self.queryset.filter(user=user)
        logger.debug(f"User profiles found: {user_profiles}")
        return user_profiles
    
    def get_object(self):
        """ Retrieve and return authenticated user's profile. """
        profile = UserProfile.objects.get(user=self.request.user)
        logger.debug(f"The user profile retrieved: {profile}")
        return profile

    def list(self, request, *args, **kwargs):
        response = super(UserProfileViewSet, self).list(request, *args, **kwargs)
        logger.debug(f"Response data: {response.data}")
        return response

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        logger.debug(f"view.py : Authenticated user: {user}")

        user_profile , created = UserProfile.objects.get_or_create(user=user)

        if created :
            logger.info(f"Created new profile for user: {user.username}")
        else:
            logger.info(f"Profile already exists for user: {user.username}")
        serializer = UserProfileSerializer(user_profile)
        logger.debug(f"view.py : User profile data: {serializer.data}")

        return Response(serializer.data)

@login_required
def get_user_profile(request):
    user_profile = UserProfile.objects.filter(user=request.user).first()
    if user_profile:
        return JsonResponse({'username': request.user.username, 'bio': user_profile.bio})
    else:
        return JsonResponse({'error': 'User profile not found'}, status=404)



class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        print(f'the data django recieved is :username :{username} , password :{password} ')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            print(f"Username: {username}, Password: {password}")

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=201)
        else:
            return Response({'error': 'Invalid credentials'}, status=400)

class SignupView(APIView):
    permission_classes = [AllowAny]
    def post(self , request ,*args ,**kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        # Validate the data
        if not username or not password or not email:
            return Response({'error': 'All fields are required.'}, status=400)

        # Create a new user instance
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)  # Hash the password
        )

        # Create a UserProfile instance
        UserProfile.objects.create(user=user)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=201)


class UpdateUsernameView(APIView):

                                            # Require the user to be authenticated to access this view
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user                 # Get the current user making the request
        new_username = request.data.get('username') #get the new username 
        if new_username:                    # If a new username was provided
            user.username = new_username    #update it 
            user.save()                     #save the changes
            return Response({'message': 'Username updated successfully'})#return a success response
        return Response({'error': 'Invalid username'}, status=400)#return a bad response  if no new username was provided

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)  # Keep the user logged in
            return Response({'message': 'Password changed successfully'})
        return Response({'error': 'Wrong old password'}, status=400)

# views.py
@api_view(['POST'])
def search_product(request):
    data = json.loads(request.body)
    product_name = data.get('searchQuery')
    
    if not product_name:
        return Response({'error': 'Product name is required'}, status=400)
    
    db = get_mongo_connection()
    fake_product_collection = db.product_collection
    avito_products_collection = db.avito_products_collection
    jumia_products_collection = db.jumia_products_collection
    electroplanet_products_collection=db.electroplanet_products_collection
    # Check if the product already exists in the database
    # existing_product = product_collection.find_one({'name': product_name})
    # Use regex for partial matching
    regex = {'$regex': product_name, '$options': 'i'}  # 'i' for case-insensitive

    avito_products = avito_products_collection.find_one({'name': regex})
    jumia_products = jumia_products_collection.find_one({'name': regex})
    electroplanet_products = electroplanet_products_collection.find_one({'name': regex})
    
    if (avito_products ,jumia_products,electroplanet_products):
        avito_products['_id'] = str(avito_products['_id'])
        jumia_products['_id'] = str(jumia_products['_id'])
        electroplanet_products['_id'] = str(electroplanet_products['_id'])
        
        results ={
            'avito_products': avito_products if avito_products else 'No resluts from avito',
            'jumia_products': jumia_products if jumia_products else 'No results from jumia',
            'electroplanet_products': electroplanet_products if electroplanet_products else 'No results from electroplanet',
        }

        # Convert MongoDB ObjectIds to strings  
        for key, product in results.items():
            if isinstance(product, dict) and '_id' in product:
                product['_id'] = str(product['_id'])

        return Response({'status':'success' , 'data':results } , status = 200 )    

    # if existing_product:
    #     # Convert _id to a string before sending the response
    #     existing_product['_id'] = str(existing_product['_id'])
    #     return Response({'status': 'success', 'data': existing_product}, status=200)
    
    else:
        # Simulate fetching data from an external API
        fake_api_data = {
            'name': product_name,
            'description': 'This is a fake product description.',
            'price': 99.99,
            'image': 'http://example.com/fake_image.png',
        }
        
        # Save the fake data to MongoDB
        result = fake_product_collection.insert_one(fake_api_data)
        
        if result.inserted_id:
            # Convert _id to a string before sending the response
            fake_api_data['_id'] = str(result.inserted_id)
            return Response({'status': 'success', 'data': fake_api_data}, status=201)
        else:
            return Response({'status': 'fail', 'message': 'Failed to save data to MongoDB'}, status=500)


class  CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)