from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from users.models import User, BatchDetail

class StatsViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('stats_view')  # Make sure your URL name is 'stats_view'

        self.user = User.objects.create(
            name="John Doe",
            email="john@example.com",
            number="1234567890",
            password="pass1234",
            status="user"
        )

        self.batch = BatchDetail.objects.create(
            user=self.user,
            batch_number="B001",
            total_images_inspected=50,
            total_defected_images=20,
            total_non_defected_images=30,
            details="Basic test"
        )

    def test_successful_stats_fetch(self):
        payload = {
            "name": self.user.name,
            "id": self.user.id
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("batches", response.json())
        self.assertEqual(len(response.json()["batches"]), 1)
        self.assertEqual(response.json()["batches"][0]["total_images"], 50)

    def test_no_batches_found(self):
        new_user = User.objects.create(
            name="No Batches",
            email="nobatch@example.com",
            number="000000000",
            password="nope",
            status="user"
        )
        payload = {"name": new_user.name, "id": new_user.id}
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["message"], "No Details Found!")

    def test_missing_parameters(self):
        payload = {"name": self.user.name}  # Missing 'id'
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "Perimeters missing!")

    def test_invalid_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()["detail"], "Method \"GET\" not allowed.")

    def test_exception_handling(self):
        with self.settings(DEBUG_PROPAGATE_EXCEPTIONS=False):
            response = self.client.post(self.url, "invalid_json", content_type='application/json')
            self.assertEqual(response.status_code, 400)
            self.assertIn("message", response.json())
            self.assertTrue("An error occurred" in response.json()["message"])
