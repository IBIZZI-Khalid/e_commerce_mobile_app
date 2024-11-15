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
    products = list(db.product_collection.find({}, {"_id": 1, "name": 1, "description": 1, "price": 1, "image": 1}))  
    
    #converting object id to a string 
    for product in products:
        product["_id"] = str(product["_id"])
    return Response({'products_data': products})

@api_view(['GET'])
def list_categories(request):
    db = get_mongo_connection()
    categories = list(db.categories_collection.find({}, {"_id": 1, "name": 1, "description": 1, "image": 1}))  
    
    #converting object id to a string 
    for cat in categories:
        cat["_id"] = str(cat["_id"])
    return Response({'categories_data': categories})

@api_view(['GET' , 'POST'])
def list_category_products(request):
    db = get_mongo_connection()
    category = request.data.get('category') 
    products = list(db.category_screen.find({'category' : category}, {"_id": 1, "name": 1,"price" :1, "image": 1}))  
    
    #converting object id to a string 
    for product in products:
        product["_id"] = str(product["_id"])
    return Response({'category_products': products})

@api_view(['GET'])
def list_trending_products(request):
    db = get_mongo_connection()
    products = list(db.category_screen.find({'class' : 'trending'}, {"_id": 1, "name": 1,"price" :1, "image": 1,"source":1,"link":1}))  
    
    #converting object id to a string 
    for product in products:
        product["_id"] = str(product["_id"])
    return Response({'trending_products': products})

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

# views.pyimport json
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def search_product(request):
    data = json.loads(request.body)
    product_name = data.get('searchQuery')
    logger.debug(f"product_name in the backend: {product_name}")

    if not product_name:
        return Response({'error': 'Product name is required'}, status=400)

    db = get_mongo_connection()
    if not db:
        logger.error("Failed to connect to MongoDB")
        return Response({'error': 'Database connection failed'}, status=500)

    products_collection = db.category_screen
    fake_product_collection = db.product_collection

    # Use MongoDB text search
    text_query = {'$text': {'$search': product_name}}

    sources = ['avito', 'jumia', 'electroplanet']
    results = {}
    
    for source in sources:
        products = list(products_collection.find({'source': source, **text_query}, 
                      {"_id": 1, "name": 1, "price": 1, "image": 1, "source": 1, "link": 1}))
        if products:
            for product in products:
                product["_id"] = str(product["_id"])
            results[f'{source}_products'] = products

    if results:
        return Response({'status': 'success', 'data': results}, status=200)
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



from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]


    # Override the get_queryset method to filter carts by the logged-in user
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    
    # Override the perform_create method to associate the cart with the logged-in user
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


    # Define a custom action for updating the cart
    @action(detail=False, methods=['put'], url_path='update-cart')
    def update_cart(self, request):
        logger.debug('Received PUT request with data: %s', request.data)
        instance, created = Cart.objects.get_or_create(user=self.request.user)  # Get or create the cart for the logged-in user
        if not instance:
            return Response({"error": "Cart not found for the user"}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the instance with the provided data
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        # Save the updated cart
        self.perform_update(serializer)
        return Response(serializer.data)
    

    # Override the perform_update method to ensure the user is correctly set
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

