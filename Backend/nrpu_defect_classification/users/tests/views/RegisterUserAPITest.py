from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.contrib.auth.hashers import check_password
from users.models import User, AdminDetail

class RegisterUserAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = '/api/register/'  # adjust if you have named URL
        self.image = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")

    def test_get_method_not_allowed(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)

    def test_register_user_with_image(self):
        data = {
            "email": "user1@example.com",
            "password": "testpass123",
            "name": "User One",
            "number": "1234567890",
            "adminPassword": "admin123",
            "role": "user"
        }
        response = self.client.post(self.url, data=data, files={"image": self.image})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(email="user1@example.com").exists())
        self.assertIsNotNone(User.objects.get(email="user1@example.com").image)

    def test_register_user_without_image(self):
        data = {
            "email": "user2@example.com",
            "password": "testpass123",
            "name": "User Two",
            "number": "1234567890",
            "adminPassword": "admin123",
            "role": "user"
        }
        response = self.client.post(self.url, data=data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(email="user2@example.com").exists())
        self.assertFalse(User.objects.get(email="user2@example.com").image)

    def test_invalid_admin_password(self):
        data = {
            "email": "badadmin@example.com",
            "password": "testpass123",
            "name": "Bad Admin",
            "number": "1234567890",
            "adminPassword": "wrongpass",
            "role": "admin",
            "designation": "Manager"
        }
        response = self.client.post(self.url, data=data, files={"image": self.image})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid admin password", response.json()["message"])

    def test_existing_user_active(self):
        User.objects.create(email="test@example.com", name="Test", number="123", password="x", state="active")
        data = {
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Duplicate",
            "number": "1234567890",
            "adminPassword": "admin123",
            "role": "user"
        }
        response = self.client.post(self.url, data=data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("already registered", response.json()["message"])

    def test_existing_user_inactive(self):
        User.objects.create(email="test2@example.com", name="Test", number="123", password="x", state="inactive")
        data = {
            "email": "test2@example.com",
            "password": "testpass123",
            "name": "Inactive",
            "number": "1234567890",
            "adminPassword": "admin123",
            "role": "user"
        }
        response = self.client.post(self.url, data=data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("cannot be used", response.json()["message"])

    def test_register_admin_with_designation(self):
        data = {
            "email": "admin1@example.com",
            "password": "adminpass",
            "name": "Admin",
            "number": "9876543210",
            "adminPassword": "admin123",
            "role": "admin",
            "designation": "Lead"
        }
        response = self.client.post(self.url, data=data, files={"image": self.image})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(email="admin1@example.com").exists())
        self.assertTrue(AdminDetail.objects.filter(user__email="admin1@example.com").exists())
        self.assertEqual(AdminDetail.objects.get(user__email="admin1@example.com").designation, data["designation"])

    def test_admin_registration_without_designation(self):
        data = {
            "email": "admin2@example.com",
            "password": "adminpass",
            "name": "Admin2",
            "number": "9876543210",
            "adminPassword": "admin123",
            "role": "admin"
        }
        response = self.client.post(self.url, data=data, files={"image": self.image})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Designation Not Found", response.json()["message"])

    def test_password_is_hashed(self):
        data = {
            "email": "secure@example.com",
            "password": "mypassword",
            "name": "Secure User",
            "number": "1231231234",
            "adminPassword": "admin123",
            "role": "user"
        }
        response = self.client.post(self.url, data=data, files={"image": self.image})
        user = User.objects.get(email="secure@example.com")
        self.assertTrue(check_password("mypassword", user.password))

    def test_internal_server_error(self):
        data = {
            # "email": intentionally left blank
            "password": "testpass",
            "name": "Bad",
            "number": "1234567890",
            "adminPassword": "admin123",
            "role": "user"
        }
        response = self.client.post(self.url, data=data)
        self.assertEqual(response.status_code, 500)
        self.assertIn("Registration failed", response.json()["message"])
