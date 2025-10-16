from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User, AdminDetail

class GetUserAPITest(TestCase):

    def setUp(self):
        # Set up a regular user
        self.user = User.objects.create(
            email="regularuser@example.com",
            name="Regular User",
            number="1234567890",
            password="password123",
            status="user"
        )

        # Set up an admin user with AdminDetail
        self.admin_user = User.objects.create(
            email="adminuser@example.com",
            name="Admin User",
            number="0987654321",
            password="passwordadmin",
            status="admin"
        )
        AdminDetail.objects.create(user=self.admin_user, designation="Chief Surgeon")

        # Set up the API client for making requests
        self.client = APIClient()

    def test_get_regular_user(self):
        """Test getting a regular user's details."""
        url = reverse('get_user', args=[self.user.id])  

        # Simulate GET request to fetch user details
        response = self.client.get(url)

        # Check if the response is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Validate the returned data
        data = response.json()
        self.assertEqual(data['email'], self.user.email)
        self.assertEqual(data['name'], self.user.name)
        self.assertEqual(data['number'], self.user.number)
        self.assertEqual(data['status'], self.user.status)
        self.assertNotIn('designation', data)  # Regular user should not have designation

    def test_get_admin_user_with_details(self):
        """Test getting an admin user's details with AdminDetail."""
        url = reverse('get_user', args=[self.admin_user.id])

        # Simulate GET request to fetch admin user details
        response = self.client.get(url)

        # Check if the response is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Validate the returned data
        data = response.json()
        self.assertEqual(data['email'], self.admin_user.email)
        self.assertEqual(data['name'], self.admin_user.name)
        self.assertEqual(data['number'], self.admin_user.number)
        self.assertEqual(data['status'], self.admin_user.status)
        self.assertEqual(data['designation'], "Chief Surgeon")  # Admin should have designation

    def test_get_admin_user_without_details(self):
        """Test getting an admin user with no AdminDetail."""
        # Create another admin user with no AdminDetail
        admin_user_no_detail = User.objects.create(
            email="adminnorecord@example.com",
            name="Admin No Record",
            number="5678901234",
            password="passwordadmin",
            status="admin"
        )

        url = reverse('get_user', args=[admin_user_no_detail.id])

        # Simulate GET request
        response = self.client.get(url)

        # Check if the response is 200 OK and return message for missing AdminDetail
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Validate the returned data
        data = response.json()
        # print(response.content)
        self.assertEqual(data['message'], "Admin's Details Does not Exist!")
        