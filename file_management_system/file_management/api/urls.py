# file_management/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from file_management.api.views import DirectoryViewSet, FileViewSet

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'directories', DirectoryViewSet, basename='directory')
router.register(r'files', FileViewSet, basename='file')

# Define URL patterns using the router
urlpatterns = [
    path('', include(router.urls)),  # Include all the routes defined in the router
]
