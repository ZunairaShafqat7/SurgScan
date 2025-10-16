from django.test import TestCase, Client
from users.models import User, BatchDetail

class GetAllUsersViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = '/admini/get-users/'
        self.user1 = User.objects.create(
            email='user1@example.com',
            name='User One',
            number='123456789',
            password='password',
            status='user',
            state='active'
        )
        self.user2 = User.objects.create(
            email='user2@example.com',
            name='User Two',
            number='987654321',
            password='password',
            status='admin',
            state='active'
        )
        BatchDetail.objects.create(
            user=self.user1,
            batch_number='B001',
            total_images_inspected=10,
            total_defected_images=3,
            total_non_defected_images=7,
            details='Details here'
        )

    def test_get_all_users_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('id', data)
        self.assertEqual(len(data['id']), 2)
        self.assertIn(self.user1.name, data['name'])
        self.assertIn(self.user2.name, data['name'])
    def test_get_all_users_empty(self):
        User.objects.all().delete()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("message", data)
        self.assertEqual(data["message"], "No users exist")
        self.assertEqual(data["data"]["id"], [])
        self.assertEqual(data["data"]["name"], [])
        self.assertEqual(data["data"]["total_batches"], [])
        self.assertEqual(data["data"]["status"], [])
    def test_get_all_users_invalid_method(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Invalid request method.'})
