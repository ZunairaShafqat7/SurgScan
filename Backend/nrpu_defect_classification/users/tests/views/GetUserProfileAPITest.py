from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from users.models import User, BatchDetail
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.timezone import now
import tempfile

class GetUserProfileAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('api_get_user_profile')  # Ensure this matches your URL name
        
        self.user = User.objects.create(
            name="John Doe",
            email="john@example.com",
            number="1234567890",
            password="password123",
            status="user"
        )
        
        self.batch = BatchDetail.objects.create(
            user=self.user,
            batch_number="Batch001",
            total_images_inspected=100,
            total_defected_images=30,
            total_non_defected_images=70,
            details="First run"
        )

    def test_valid_user_profile_with_batch(self):
        response = self.client.post(self.url, {"name": self.user.name, "id": self.user.id}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("batch_details", response.json())
        self.assertEqual(response.json()["name"], self.user.name)
        self.assertEqual(len(response.json()["batch_details"]), 1)

    def test_valid_user_profile_with_no_batches(self):
        # New user with no batch
        user2 = User.objects.create(name="Empty", email="empty@example.com", number="000", password="pwd", status="user")
        response = self.client.post(self.url, {"name": user2.name, "id": user2.id}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["batch_details"]), 0)

    def test_user_not_found(self):
        response = self.client.post(self.url, {"name": "Fake", "id": 999}, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["message"], "User not found!")

    def test_missing_parameters(self):
        response = self.client.post(self.url, {"id": self.user.id}, format='json')
        self.assertEqual(response.status_code, 404)  # user.name is required

    def test_wrong_method_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)
        self.assertIn("Method \"GET\" not allowed.", response.json()["detail"])

    def test_user_profile_with_image(self):
        # Add an image to user
        image_file = SimpleUploadedFile("test.jpg", b"dummycontent", content_type="image/jpeg")
        self.user.image = image_file
        self.user.save()

        response = self.client.post(self.url, {"name": self.user.name, "id": self.user.id}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("picture_url", response.json())
        self.assertIsNotNone(response.json()["picture_url"])
