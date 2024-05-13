from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from .mongo_utils import get_mongo_connection  # Import the MongoDB utility



@api_view(['GET'])
def list_mongo_products(request):
    db = get_mongo_connection()
    products = list(db.product_collection.find({}, {"_id": 0}))  # Exclude _id field
    # Assume that we serialize data properly here
    return Response({'products_data': products})


# @api_view(['POST'])
# def add_mongo_product(request):
#     db = get_mongo_connection()
#     new_product = request.data
#     # Ensure validation and sanitation of input data
#     result = db.product_collection.insert_one(new_product)
#     return Response({'_id': str(result.inserted_id)})

from rest_framework import status
import logging
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



# Create your views here.
# views is what the user sees (functions / data /...)
# we gotta link it to a url tho 

from rest_framework import viewsets
from .models import Product, Category, Order, OrderItem, UserProfile
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, OrderItemSerializer, UserProfileSerializer


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

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        """ Ensure users can only see their own profile. """
        return self.queryset.filter(user=self.request.user)

from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.urls import reverse_lazy

class CustomLoginView(LoginView):
    template_name = 'registration/login.html' 
    redirect_authenticated_user = True  # Redirect users who are already logged in
    success_url = reverse_lazy('home')  

    def form_valid(self, form):
        # Call super to make sure the user is logged in
        response = super().form_valid(form)
        # Add a success message
        messages.success(self.request, f"Welcome back, {self.request.user.username}!")
        return response


from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import UserRegisterForm 
def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registration successful. Welcome ,{username}!".format(username=user.username))
            return redirect('home')
        
        else:
            messages.error(request, "Unsuccessful registration. Invalid information.")
    else:
        form = UserRegisterForm()
    return render(request, 'registration/register.html', {'form': form})




from django.contrib.auth.decorators import login_required
@login_required
def home(request):
    return render(request, 'home.html')

@login_required
def profile(request):
    return render(request, 'profile.html')































# @api_view([ 'GET']) #the user can only GET this data 
# def get_products(request):
#   products_data =[
#     {
#       "id": 1,
#       "name": "T-Shirt",
#       "description": "A comfortable and stylish T-Shirt",
#       "price": 19.99,
#       "image": "https://example.com/images/t-shirt.jpg"
#     },
#     {
#       "id": 2,
#       "name": "Laptop",
#       "description": "A powerful laptop for all your needs",
#       "price": 799.99,
#       "image": "https://example.com/images/laptop.jpg"
#     },
#     {
#       "id": 3,
#       "name": "Headphones",
#       "description": "Noise-canceling headphones for immersive sound",
#       "price": 99.99,
#       "image": "https://example.com/images/headphones.jpg"
#     }
#   ]

#   # Return the data as a JSON response
#   return Response(products_data)
   
