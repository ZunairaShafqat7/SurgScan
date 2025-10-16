from django.db import models
from datetime import datetime


class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, default="Default Name")
    number = models.CharField(max_length=15)
    password = models.CharField(max_length=255)
    status = models.CharField(max_length=10, default='user')
    state = models.CharField(max_length=10, default='active')
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class BatchDetail(models.Model):
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('inprogress', 'In Progress'),
    ]

    INSTRUMENT_CHOICES = [
        ('Bandage Scissor', 'Bandage Scissor'),
        ('Carver', 'Carver'),
        ('Dressing Forcep', 'Dressing Forcep'),
        ('Ex-Probe', 'Ex-Probe'),
        ('Mcindoe Forcep', 'Mcindoe Forcep'),
        ('Nail Clipper', 'Nail Clipper'),
        ('Probe', 'Probe'),
        ('Scalpal', 'Scalpal'),
        ('Scissor', 'Scissor'),
        ('Teale Vulsellum Forceps', 'Teale Vulsellum Forceps'),
        ('Uterine Curette', 'Uterine Curette'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='batch_details')
    batch_number = models.CharField(max_length=50)
    instrument = models.CharField(max_length=50, choices=INSTRUMENT_CHOICES, null=True, blank=True)
    total_images_inspected = models.PositiveIntegerField()
    total_defected_images = models.PositiveIntegerField()
    total_non_defected_images = models.PositiveIntegerField()
    details = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='inprogress')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Batch {self.batch_number} ({self.instrument}) - {self.user.email}'


def batch_image_path(instance, filename):
    timestamp = datetime.now().strftime('%y%m%d_%H:%M:%S')
    return f'inspection_images/{instance.batch_detail.batch_number}/{timestamp}_{filename}'


class BatchImage(models.Model):
    batch_detail = models.ForeignKey(BatchDetail, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=batch_image_path)  # Custom upload path
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Image for Batch {self.batch_detail.batch_number} uploaded at {self.uploaded_at}'


class Instrument(models.Model):
    batch = models.ForeignKey(BatchDetail, on_delete=models.CASCADE, related_name='instruments')
    name = models.CharField(max_length=255)  # Instrument name (e.g., Scissor, Forcep)
    total_inspected = models.PositiveIntegerField(default=0)
    total_defected = models.PositiveIntegerField(default=0)
    total_undefected = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.name} in Batch {self.batch.batch_number}'


class Defect(models.Model):
    instrument = models.ForeignKey(Instrument, on_delete=models.CASCADE, related_name='defects')
    name = models.CharField(max_length=255)  # Example: Crack, Rust, Loose joint
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f'Defect {self.name} in Instrument {self.instrument.name}'


class AdminDetail(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_detail')
    designation = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.user.name} - {self.designation}'
