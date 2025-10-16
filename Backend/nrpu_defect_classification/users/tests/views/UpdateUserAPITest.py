from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import User, AdminDetail
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.hashers import make_password,check_password

class UpdateUserAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

        # Create a regular user
        self.user = User.objects.create(
            email="user@example.com",
            name="Test User",
            number="123456789",
            password=make_password("password123"),
            status="user",
            state="active"
        )

        # Create an admin user
        self.admin_user = User.objects.create(
            email="admin@example.com",
            name="Admin User",
            number="987654321",
            password=make_password("adminpass"),
            status="admin",
            state="active"
        )
    
    def test_successful_update_user(self):
        """Test successful user update with all fields."""
        url = reverse('api_update_user', args=[self.user.id])  # Replace with your URL name
        updated_data = {
            "email": "updated@example.com",
            "password": "newpassword123",
            "name": "Updated Name",
            "number": "987654321",
            "adminPassword": "admin123",
            "status": "admin",
            "role": "user"
        }
        response = self.client.post(url, updated_data, format='multipart')
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data['message'], "User updated successfully!")
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, "updated@example.com")
        self.assertEqual(check_password("newpassword123", self.user.password),True)
        self.assertEqual(self.user.name, "Updated Name")
        self.assertEqual(self.user.number, "987654321")
    def test_partial_update_user(self):
        """Test partial update: only email is updated, other fields remain unchanged."""
        url = reverse('api_update_user', args=[self.user.id])
        updated_data = {
            "email": "updated@example.com",
            "adminPassword": "admin123",
            "status": "admin"
        }
        response = self.client.post(url, updated_data, format='multipart')
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, "updated@example.com")
        self.assertEqual(self.user.name, "Test User")  # Name should remain unchanged
    
    def test_invalid_user_id(self):
        """Test update with an invalid user ID."""
        url = reverse('api_update_user', args=[999])  # Invalid user ID
        updated_data = {
            "email": "nonexistent@example.com",
            "adminPassword": "admin123",
            "status": "admin"
        }
        response = self.client.post(url, updated_data, format='multipart')
        self.assertEqual(response.status_code, 500)
    
    def test_admin_password_check(self):
        """Test that admin updates require a valid admin password."""
        url = reverse('api_update_user', args=[self.admin_user.id])
        updated_data = {
            "email": "adminupdated@example.com",
            "adminPassword": "wrongpassword",  # Incorrect admin password
            "status": "admin"
        }
        response = self.client.post(url, updated_data, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["message"], "Invalid admin password.")
    
    def test_image_upload(self):
        """Test that an image can be successfully uploaded and updated."""
        url = reverse('api_update_user', args=[self.user.id])
        # Simulate an image upload
        image_data = SimpleUploadedFile("new_image.jpg", b"file_content", content_type="image/jpeg")
        updated_data = {
            "image": image_data,
            "adminPassword": "admin123",
            "status": "admin"
        }
        response = self.client.post(url, updated_data, format='multipart')
        print(response.content)
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.image)

    def test_role_change_to_admin(self):
        """Test changing a user's role to admin and providing a designation."""
        url = reverse('api_update_user', args=[self.user.id])
        updated_data = {
            "status": "admin",
            "role": "admin",
            "designation": "Manager",
            "adminPassword": "admin123",  # Correct admin password
        }
        response = self.client.post(url, updated_data, format='multipart')
        
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.status, "admin")
        admin_detail = AdminDetail.objects.get(user=self.user)
        self.assertEqual(admin_detail.designation, "Manager")

    def test_method_not_allowed(self):
        """Test accessing the API with a non-POST method."""
        url = reverse('api_update_user', args=[self.user.id])
        response = self.client.get(url)  # Sending a GET request
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()["message"], "Method not allowed")
