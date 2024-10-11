# file_management/api/serializers.py

from rest_framework import serializers
from file_management.models import Directory, File

class DirectorySerializer(serializers.ModelSerializer):
    subdirectories = serializers.SerializerMethodField()

    class Meta:
        model = Directory
        fields = ['id', 'name', 'parent', 'subdirectories']

    def get_subdirectories(self, obj):
        """Returns a list of subdirectories for the current directory."""
        sub_dirs = obj.subdirectories.all()
        return DirectorySerializer(sub_dirs, many=True).data


class FileSerializer(serializers.ModelSerializer):
    file = serializers.FileField()

    class Meta:
        model = File
        fields = ['id', 'name', 'directory', 'file']
