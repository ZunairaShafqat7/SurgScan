from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from users.models import User, BatchDetail
from django.urls import reverse
from PIL import Image
import io
import numpy as np

from unittest.mock import patch, MagicMock

class InspectImageTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(email="test@example.com", name="Test", number="123", password="1234")
        self.batch = BatchDetail.objects.create(user=self.user, batch_number="BATCH001", total_images_inspected=0, total_defected_images=0, total_non_defected_images=0)

    def create_image_file(self):
        with open('defected_instrument.JPG', 'rb') as img:
            image_file = SimpleUploadedFile('image.jpg', img.read(), content_type='image/jpeg')
        return image_file
        

    def test_get_method_not_allowed(self):
        response = self.client.get("/api/inspect-image/")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())
        print("Method Not Allowed: ", response.content)

    def test_missing_parameters(self):
        image_file = self.create_image_file()
        response = self.client.post('/api/inspect-image/', {
                'batch': self.batch.batch_number,
                'image': image_file,
                # 'id': intentionally missing
            })
        self.assertEqual(response.status_code, 400)
        print("Missing Perimeters: ", response.content)

    def test_invalid_batch(self):
        image_file = self.create_image_file()
        response = self.client.post('/api/inspect-image/', {
                'batch': "Dummy Batch",
                'image': image_file,
                'id': self.user.id
            })
        self.assertEqual(response.status_code, 404)
        print("Invalid Batch: ", response.content)

    def test_corrupt_image(self):
        fake_image = SimpleUploadedFile("test.txt", b"not really an image", content_type="text/plain")
        response = self.client.post('/api/inspect-image/', {
                'batch': self.batch.batch_number,
                'image': fake_image,
                'id': self.user.id
            })
        self.assertEqual(response.status_code, 500)
        self.assertIn("Failed to open image", response.json()["error"])
        print("Corrupt Image: ", response.content)


    def test_inspection(self):
        image_file = self.create_image_file()
        response = self.client.post('/api/inspect-image/', {
                'batch': self.batch.batch_number,
                'image': image_file,
                'id': self.user.id
            })
        self.assertEqual(response.status_code, 200)
        print("Successfull Prediction: ", response.content)