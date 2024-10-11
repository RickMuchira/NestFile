# file_management/admin.py
from django.contrib import admin
from .models import Directory, File

class DirectoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'parent')  # Display ID, name, and parent directory
    search_fields = ('name',)  # Allow search by directory name
    list_filter = ('parent',)  # Add filter by parent directory
    ordering = ('id',)  # Order by ID in the list view

class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'directory')  # Display ID, name, and associated directory
    search_fields = ('name',)  # Allow search by file name
    list_filter = ('directory',)  # Add filter by directory
    ordering = ('id',)  # Order by ID in the list view

# Register your models to the admin site
admin.site.register(Directory, DirectoryAdmin)
admin.site.register(File, FileAdmin)
