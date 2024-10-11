# file_management/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from file_management.api.views import DirectoryViewSet, FileViewSet
from file_management import views

# Set up DRF routers for Directory and File APIs
router = DefaultRouter()
router.register(r'directories', DirectoryViewSet)
router.register(r'files', FileViewSet)

urlpatterns = [
    path('api/', include(router.urls)),  # Include the DRF router paths for API endpoints
    path('', views.home, name='home'),  # Home page
    path('directory/<int:directory_id>/', views.directory_details, name='directory_details'),  # Directory details
    path('directory/<int:directory_id>/delete/', views.delete_directory, name='delete_directory'),  # Delete directory
    path('file/<int:file_id>/delete/', views.delete_file, name='delete_file'),  # Delete file
]
