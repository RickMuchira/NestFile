# file_management/api/views.py

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.db.models import Q
from file_management.models import Directory, File
from file_management.serializers import DirectorySerializer, FileSerializer


class DirectoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage directories, including nested subdirectories and their files.
    """
    queryset = Directory.objects.all()
    serializer_class = DirectorySerializer

    @action(detail=True, methods=['post'])
    def create_subdirectory(self, request, pk=None):
        """
        Create a subdirectory within a specific directory.
        """
        parent_directory = self.get_object()
        subdirectory_name = request.data.get('name', '').strip()

        if not subdirectory_name:
            raise ValidationError("Subdirectory name cannot be empty.")

        # Create the subdirectory with the parent set to the current directory
        subdirectory = Directory.objects.create(name=subdirectory_name, parent=parent_directory)
        serializer = DirectorySerializer(subdirectory, context=self.get_serializer_context())
        return Response(serializer.data, status=201)

    @action(detail=True, methods=['get'])
    def sub_directories(self, request, pk=None):
        """
        List subdirectories of the current directory.
        """
        directory = self.get_object()
        sub_dirs = directory.subdirectories.all()
        serializer = self.get_serializer(sub_dirs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def files(self, request, pk=None):
        """
        List files within a specific directory.
        """
        directory = self.get_object()
        files = directory.files.all()
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'])
    def delete_directory(self, request, pk=None):
        """
        Delete a directory only if it's empty.
        """
        directory = self.get_object()

        # Check if the directory is not empty (has subdirectories or files)
        if directory.subdirectories.exists() or directory.files.exists():
            raise ValidationError("Cannot delete a non-empty directory. Delete all contents first or use a recursive delete.")
        
        # Delete the directory
        directory.delete()
        return Response({"message": f"Directory '{directory.name}' was deleted successfully."}, status=204)

    @action(detail=True, methods=['post'])
    def delete_directory_and_contents(self, request, pk=None):
        """
        Recursively delete a directory and all its subdirectories and files.
        """
        directory = self.get_object()
        directory.delete()
        return Response({"message": f"Directory '{directory.name}' and all its contents were deleted successfully."}, status=204)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search for directories based on the query parameter.
        """
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Query parameter 'q' is required."}, status=400)

        # Search for directories matching the query
        directories = Directory.objects.filter(name__icontains=query)
        serializer = self.get_serializer(directories, many=True)
        return Response(serializer.data)


class FileViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage files within directories.
    """
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def perform_create(self, serializer):
        """
        Handle file upload and associate it with the correct directory.
        """
        directory_id = self.request.data.get('directory', None)
        if not directory_id:
            raise ValidationError("Please provide a valid directory ID.")

        directory = get_object_or_404(Directory, id=directory_id)
        serializer.save(directory=directory)

    def update(self, request, *args, **kwargs):
        """
        Override the update method to allow renaming files without changing their directory.
        """
        instance = self.get_object()
        new_name = request.data.get('name', None)

        if not new_name:
            raise ValidationError("File name cannot be empty.")
        
        # Retain the existing directory unless explicitly changed
        directory_id = request.data.get('directory', instance.directory.id)
        
        # Ensure that the directory ID exists
        directory = get_object_or_404(Directory, id=directory_id)

        # Update the file's name and directory
        instance.name = new_name
        instance.directory = directory
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search for files based on the query parameter.
        """
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Query parameter 'q' is required."}, status=400)

        # Search for files matching the query
        files = File.objects.filter(name__icontains=query)
        serializer = self.get_serializer(files, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Custom action to download a file by its ID.
        """
        file = self.get_object()
        file_path = file.file.path  # Assuming `file` is a FileField in the model

        # Try to serve the file for download
        try:
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file.name)
        except FileNotFoundError:
            raise Http404("File not found.")
