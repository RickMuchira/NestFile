# file_management/serializers.py

from rest_framework import serializers
from file_management.models import Directory, File

class DirectorySerializer(serializers.ModelSerializer):
    subdirectories = serializers.SerializerMethodField()
    files = serializers.SerializerMethodField()

    class Meta:
        model = Directory
        fields = ['id', 'name', 'parent', 'subdirectories', 'files']

    def get_subdirectories(self, obj):
        """
        Recursively serialize subdirectories up to a specified depth to prevent infinite recursion.
        """
        max_depth = self.context.get("max_depth", 3)  # Set a default max depth of 3
        current_depth = self.context.get("current_depth", 0)

        # Check if the current depth has reached the maximum allowed depth
        if current_depth >= max_depth:
            return []  # Stop further serialization if max depth is reached

        # Track visited directories to avoid cycles
        visited = self.context.get("visited", set())
        if obj.id in visited:
            return []  # Return an empty list if this directory has been visited before (cycle detected)

        # Update the context with the current directory and depth information
        visited.add(obj.id)
        context = {
            "max_depth": max_depth,
            "current_depth": current_depth + 1,
            "visited": visited
        }

        # Serialize subdirectories with updated context
        sub_dirs = obj.subdirectories.all()
        return DirectorySerializer(sub_dirs, many=True, context=context).data

    def get_files(self, obj):
        """
        Returns a list of files for the current directory.
        """
        files = obj.files.all()
        return FileSerializer(files, many=True).data


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'directory', 'file']
