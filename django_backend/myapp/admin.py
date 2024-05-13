from django.contrib import admin
from .models import Category, Product, Order, OrderItem, UserProfile


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'paid', 'created_at', 'total_price')
    list_filter = ('paid', 'created_at')
    inlines = [OrderItemInline]

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'in_stock', 'category', 'created_at', 'updated_at')
    list_filter = ('in_stock', 'category')
    search_fields = ('name','description')

# Register your models here.
#this send the nammed models to the django admin page 
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(UserProfile)
