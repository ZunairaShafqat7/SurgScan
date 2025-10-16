from django.test import TestCase
from django.urls import reverse

class IndexViewTests(TestCase):

    def test_index_view_renders_correct_template(self):
        """Test that the index view renders the correct template and returns 200 OK."""
        # Use the reverse function to generate the URL for the index view
        url = reverse('index')  # This assumes the name of the view's URL is 'index'

        # Make a GET request to the index view
        response = self.client.get(url)

        # Check that the response is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check that the correct template is used
        self.assertTemplateUsed(response, 'index.html')

