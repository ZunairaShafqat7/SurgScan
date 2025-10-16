from django.test import TestCase, Client
from users.models import User
from django.urls import reverse

class DeleteUserViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(
            email="deleteuser@example.com",
            name="Delete User",
            number="0000000000",
            password="testpass",
            status="user",
            state="active"
        )
        self.url = f'/admini/delete-user/{self.user.id}/'

    def test_delete_user_sets_state_inactive(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.state, 'inactive')
        self.assertIn("message", response.json())
        self.assertEqual(response.json()["message"], "User status set to inactive")

    def test_delete_already_inactive_user(self):
        self.user.state = 'inactive'
        self.user.save()

        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "User is already DELETED")

    def test_delete_nonexistent_user(self):
        response = self.client.delete('/admini/delete-user/9999/')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["error"], "User not found")

    def test_delete_user_invalid_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"], "Invalid request method.")
