# file_management/models.py

from django.db import models
from django.core.exceptions import ValidationError


class Directory(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey(
        'self', null=True, blank=True, related_name='subdirectories', on_delete=models.CASCADE
    )

    def __str__(self):
        return self.name

    def is_root(self):
        """Check if this directory is a root directory (has no parent)."""
        return self.parent is None

    def clean(self):
        """Override the clean method to prevent cyclic references."""
        if self.pk and self.parent:
            ancestor = self.parent
            while ancestor is not None:
                if ancestor == self:
                    raise ValidationError("A directory cannot be its own ancestor.")
                ancestor = ancestor.parent

    def save(self, *args, **kwargs):
        """Override save method to call clean for validation before saving."""
        self.clean()
        super().save(*args, **kwargs)


class File(models.Model):
    name = models.CharField(max_length=255)
    directory = models.ForeignKey(Directory, related_name='files', on_delete=models.CASCADE)
    file = models.FileField(upload_to='files/')

    def __str__(self):
        return self.name
