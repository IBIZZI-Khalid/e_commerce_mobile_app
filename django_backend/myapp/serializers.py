#Serializers in Python are used to convert complex objects into a format that can be easily transmitted and stored.
#often used in web development to convert data into a format like JSON or XML, which can be easily sent over the internet.
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Product, Category, Order, OrderItem, UserProfile

class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name','category', 'description', 'price', 'in_stock']  # fields to include



class CategorySerializer( ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class OrderItemSerializer( ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'updated_at', 'paid', 'total_price']


from django.contrib.auth.models import User 
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']

class UserProfileSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'bio']

        
# class UserProfileSerializer( ModelSerializer):
#     username = serializers.CharField(source='user.username', read_only=True)
#     email = serializers.EmailField(source='user.email', read_only=True)

#     class Meta:
#         model = UserProfile
#         fields = ['username' , 'email']


# # serializers.py
# from django.contrib.auth.models import User
# from rest_framework import serializers

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username' , 'email',]
