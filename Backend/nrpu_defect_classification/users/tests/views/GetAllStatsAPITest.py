from django.test import TestCase, Client
from django.urls import reverse
from users.models import User, BatchDetail

class GetAllStatsViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = '/admini/stats/'  # Update this if you're using `reverse()`
        self.user = User.objects.create(email='user@example.com', name='Test User', number='1234567890', password='password')
        BatchDetail.objects.create(
            user=self.user,
            batch_number='BATCH-001',
            total_images_inspected=10,
            total_defected_images=3,
            total_non_defected_images=7,
            details='Test batch details'
        )

    def test_get_all_stats_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('batches', response.json())
        self.assertEqual(len(response.json()['batches']), 1)
    def test_get_all_stats_no_batches(self):
        BatchDetail.objects.all().delete()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('batches', response.json())
        self.assertEqual(response.json()['batches'], [])
        self.assertEqual(response.json()['message'], "No batches exist")
    def test_get_all_stats_invalid_method(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Invalid request method.'})
