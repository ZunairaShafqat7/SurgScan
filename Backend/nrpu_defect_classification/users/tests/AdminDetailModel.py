from django.test import TestCase
from users.models import User, AdminDetail

class AdminDetailModelTest(TestCase):

    def setUp(self):
        # Create a user instance for the AdminDetail foreign key
        self.admin_user = User.objects.create(
            email="adminuser@example.com",
            name="Admin User",
            number="1234567890",
            password="passwordadmin",
            status="admin"
        )
        # Create an AdminDetail instance
        self.admin_detail = AdminDetail.objects.create(
            user=self.admin_user,
            designation="Head of Surgery"
        )

    def test_admin_detail_creation(self):
        """Test that an AdminDetail instance can be created successfully."""
        self.assertEqual(self.admin_detail.user, self.admin_user)
        self.assertEqual(self.admin_detail.designation, "Head of Surgery")

    def test_admin_detail_one_to_one(self):
        """Test the one-to-one relationship between AdminDetail and User."""
        self.assertEqual(self.admin_detail.user, self.admin_user)

    def test_admin_detail_str_method(self):
        """Test the string representation of the AdminDetail model."""
        expected_str = f"{self.admin_user.name} - Head of Surgery"
        self.assertEqual(str(self.admin_detail), expected_str)
