from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import User, BatchDetail

class BatchDetailsViewTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            name="Test User",
            email="testuser@example.com",
            number="0001112222",
            password="password123",
            status="user"
        )
        self.existing_batch = BatchDetail.objects.create(
            user=self.user,
            batch_number="BATCH-001",
            total_images_inspected=10,
            total_defected_images=4,
            total_non_defected_images=6,
            details="Initial batch"
        )
        self.url = reverse('batch_details_view')  # update if your view name differs

    def test_valid_batch_exists(self):
        payload = {
            'id': self.user.id,
            'name': self.user.name,
            'batch': self.existing_batch.batch_number,
            'details': self.existing_batch.details
        }
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], "Welcome, Please continue inspection")
        self.assertEqual(response.json()['batch_id'], self.existing_batch.batch_number)

    def test_batch_does_not_exist(self):
        payload = {
            'id': self.user.id,
            'name': self.user.name,
            'batch': "NON_EXISTING_BATCH",
            'details': "Missing batch"
        }
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], "Batch does not exist please consult admin!")

    def test_missing_parameters(self):
        payload = {'name': self.user.name}  # missing 'id' and 'batch'
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], "Perimeters are Missing!!!")

    def test_invalid_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], "Invalid request method.")

    def test_invalid_user_id(self):
        payload = {
            'id': 999,  # invalid user
            'name': "Ghost User",
            'batch': "ANYBATCH",
            'details': "Does not matter"
        }
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, 404)  # Or handle User.DoesNotExist and return 404
        self.assertIn("message", response.json())
        self.assertEquals(response.json()["message"],"User Does not exist!")
