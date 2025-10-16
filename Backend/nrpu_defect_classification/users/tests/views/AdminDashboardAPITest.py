from django.test import TestCase, Client
from django.urls import reverse
from users.models import User

class AdminDashboardViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin_user = User.objects.create(
            email="admin@example.com",
            name="Admin",
            number="1234567890",
            password="adminpass",
            status="admin",
            state="active"
        )
        self.regular_user = User.objects.create(
            email="user@example.com",
            name="User",
            number="0987654321",
            password="userpass",
            status="user",
            state="active"
        )
        self.deleted_admin = User.objects.create(
            email="deletedadmin@example.com",
            name="Deleted Admin",
            number="1111111111",
            password="deletedpass",
            status="admin",
            state="inactive"
        )

    def test_valid_admin_dashboard(self):
        response = self.client.post(f"/admini/dashboard/{self.admin_user.email}/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json() or response.json().keys())

    def test_non_admin_access_denied(self):
        response = self.client.post(f"/admini/dashboard/{self.regular_user.email}/")
        self.assertEqual(response.status_code, 404)
        self.assertIn("message", response.json())
        self.assertIn("is not an Admin", response.json()["message"])

    def test_deleted_admin_access_denied(self):
        response = self.client.post(f"/admini/dashboard/{self.deleted_admin.email}/")
        self.assertEqual(response.status_code, 404)
        self.assertIn("message", response.json())
        self.assertIn("has been deleted", response.json()["message"])

    def test_non_existent_email(self):
        response = self.client.post("/admini/dashboard/nonexistent@example.com/")
        self.assertEqual(response.status_code, 404)
        self.assertIn("error", response.json())

    def test_invalid_request_method(self):
        response = self.client.get(f"/admini/dashboard/{self.admin_user.email}/")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())
        self.assertIn("Invalid request method", response.json()["error"])
