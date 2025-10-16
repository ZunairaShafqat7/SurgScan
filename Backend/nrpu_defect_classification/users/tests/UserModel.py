from django.test import TestCase
from users.models import User

class UserModelTest(TestCase):

    def setUp(self):
        # Create a user instance for testing
        self.user = User.objects.create(
            email="testuser@example.com",
            name="Test User",
            number="1234567890",
            password="password123",
            image=None  # No image for this test
        )

    def test_user_creation(self):
        """Test user model creation."""
        self.assertEqual(self.user.email, "testuser@example.com")
        self.assertEqual(self.user.name, "Test User")
        self.assertEqual(self.user.number, "1234567890")
        self.assertEqual(self.user.state, "active")  # Check default state
        self.assertEqual(self.user.status, "user")   # Check default status
        self.assertEqual(self.user.image, None)
    def test_user_str_method(self):
        """Test the string representation of the user model."""
        self.assertEqual(str(self.user), "testuser@example.com")
    def test_user_default_state(self):
        # Check the default state of the user
        self.assertEqual(self.user.state, "active")