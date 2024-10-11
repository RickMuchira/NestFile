# file_management/views.py

from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import ValidationError
from .models import Directory, File

def home(request):
    """
    Render the home page for the file management system.
    """
    return render(request, 'file_management/home.html')


def directory_details(request, directory_id):
    """
    View to display the details of a specific directory.
    Shows the directory contents and allows subdirectory creation and file upload.
    """
    directory = Directory.objects.get(pk=directory_id)
    subdirectories = directory.subdirectories.all()
    files = directory.files.all()

    context = {
        'directory': directory,
        'subdirectories': subdirectories,
        'files': files,
    }
    return render(request, 'file_management/directory_details.html', context)


def delete_directory(request, directory_id):
    """
    Delete a directory if it is empty or delete recursively if specified.
    """
    directory = Directory.objects.get(pk=directory_id)

    # Check if the directory is empty before allowing deletion
    if directory.subdirectories.exists() or directory.files.exists():
        return HttpResponse("Cannot delete a non-empty directory. Please delete its contents first or use recursive deletion.", status=400)

    directory.delete()
    return HttpResponse(f"Directory '{directory.name}' was deleted successfully.")


def delete_file(request, file_id):
    """
    Delete a specific file and redirect to its parent directory.
    """
    file = File.objects.get(pk=file_id)
    parent_directory_id = file.directory.id
    file_name = file.name

    file.delete()
    return HttpResponse(f"File '{file_name}' was deleted successfully from directory ID {parent_directory_id}.")
