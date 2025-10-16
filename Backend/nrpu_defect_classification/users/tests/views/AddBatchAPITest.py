from django.test import TestCase, Client
from django.urls import reverse
from django.utils.timezone import now
from users.models import User, BatchDetail  # Adjust path as per your project

class AddBatchToUserTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = '/admini/add-batch/'  # Replace with reverse('add_batch_to_user') if named

        self.user = User.objects.create(
            email='testuser@example.com',
            name='Test User',
            number='1234567890',
            password='hashedpassword',
            status='user'
        )

    def test_successful_batch_creation(self):
        response = self.client.post(self.url, {
            'email': self.user.email,
            'details': 'New batch for defect testing'
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn('batch_number', response.json())
        self.assertTrue(BatchDetail.objects.filter(user=self.user).exists())

    def test_missing_email(self):
        response = self.client.post(self.url, {
            'details': 'Missing email test'
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_user_not_found(self):
        response = self.client.post(self.url, {
            'email': 'nonexistent@example.com',
            'details': 'Batch for ghost user'
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('message', response.json())
        self.assertEqual(response.json()['message'], "User not found!")

    def test_invalid_request_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_batch_details_are_correct(self):
        response = self.client.post(self.url, {
            'email': self.user.email,
            'details': 'Batch check details'
        })

        batch_number = response.json().get('batch_number')
        batch = BatchDetail.objects.get(batch_number=batch_number)

        self.assertEqual(batch.user, self.user)
        self.assertEqual(batch.details, 'Batch check details')
        self.assertEqual(batch.status, 'inprogress')
        self.assertEqual(batch.total_images_inspected, 0)
