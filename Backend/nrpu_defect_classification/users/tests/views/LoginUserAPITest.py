from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import User, BatchDetail
from django.contrib.auth.hashers import make_password

class LoginUserAPITest(TestCase):

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

        # Create an inactive user
        self.inactive_user = User.objects.create(
            email="inactive@example.com",
            name="Inactive User",
            number="555666777",
            password=make_password("inactivepass"),
            status="user",
            state="inactive"
        )

        # Create batch details for the regular user
        BatchDetail.objects.create(
            user=self.user,
            batch_number="BATCH001",
            total_images_inspected=10,
            total_defected_images=2,
            total_non_defected_images=8,
            details="Initial batch"
        )

    def test_successful_login_regular_user(self):
        """Test successful login for a regular user with valid credentials."""
        url = reverse('api_login_user')  # Replace with your URL name
        data = {"email": "user@example.com", "password": "password123"}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data['message'], "Login successful!")
        self.assertEqual(response_data['status'], "user")
        self.assertEqual(response_data['name'], self.user.name)
        self.assertEqual(response_data['id'], self.user.id)
        self.assertIn("batch_details", response_data)
        self.assertEqual(len(response_data['batch_details']), 1)

    def test_invalid_password(self):
        """Test login with an invalid password."""
        url = reverse('api_login_user')
        data = {"email": "user@example.com", "password": "wrongpassword"}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertEqual(response_data['message'], "Invalid password!")

    def test_email_not_found(self):
        """Test login with an invalid email."""
        url = reverse('api_login_user')
        data = {"email": "nonexistent@example.com", "password": "password123"}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertEqual(response_data['message'], "Email not found!")

    def test_inactive_user(self):
        """Test login with an inactive user."""
        url = reverse('api_login_user')
        data = {"email": "inactive@example.com", "password": "inactivepass"}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertEqual(response_data['message'], "Email not found!")  # Inactive users should be handled

    def test_admin_login(self):
        """Test successful login for an admin user."""
        url = reverse('api_login_user')
        data = {"email": "admin@example.com", "password": "adminpass"}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data['message'], "Login successful!")  # Admin dashboard details returned

    def test_invalid_json_format(self):
        """Test invalid JSON format in the request body."""
        url = reverse('api_login_user')
        response = self.client.post(url, "invalid_json", content_type='application/json')

        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertEqual(response_data['message'], "Invalid JSON format")

    def test_method_not_allowed(self):
        """Test accessing the API with a non-POST method."""
        url = reverse('api_login_user')
        response = self.client.get(url)  # Sending a GET request

        self.assertEqual(response.status_code, 405)
        response_data = response.json()
        self.assertEqual(response_data['message'], "Method not allowed")
