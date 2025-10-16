from django.test import TestCase
from django.utils import timezone
from users.models import User, BatchDetail

class BatchDetailModelTest(TestCase):

    def setUp(self):
        # Create a User instance for testing
        self.user = User.objects.create(
            email="batchuser@example.com",
            name="Batch User",
            number="9876543210",
            password="password123",
        )
        
        # Create a BatchDetail instance for testing
        self.batch_detail = BatchDetail.objects.create(
            user=self.user,
            batch_number="BATCH001",
            total_images_inspected=100,
            total_defected_images=10,
            total_non_defected_images=90,
            details="Initial batch details"
        )

    def test_batch_detail_creation(self):
        """Test that a BatchDetail instance is created correctly."""
        self.assertEqual(self.batch_detail.batch_number, "BATCH001")
        self.assertEqual(self.batch_detail.total_images_inspected, 100)
        self.assertEqual(self.batch_detail.total_defected_images, 10)
        self.assertEqual(self.batch_detail.total_non_defected_images, 90)
        self.assertEqual(self.batch_detail.details, "Initial batch details")
        self.assertEqual(self.batch_detail.status, "inprogress")  # Default value for status
        self.assertIsNotNone(self.batch_detail.created_at)  # Auto-set created_at field

    def test_batch_detail_foreign_key(self):
        """Test the foreign key relationship between BatchDetail and User."""
        self.assertEqual(self.batch_detail.user, self.user)

    def test_batch_detail_str_method(self):
        """Test the string representation of the BatchDetail model."""
        expected_str = f"Batch {self.batch_detail.batch_number} - {self.user.email}"
        self.assertEqual(str(self.batch_detail), expected_str)

    def test_null_and_blank_details(self):
        """Test that the details field can be null or blank."""
        batch_no_details = BatchDetail.objects.create(
            user=self.user,
            batch_number="BATCH002",
            total_images_inspected=50,
            total_defected_images=5,
            total_non_defected_images=45,
            details=None  # Setting details as None
        )
        self.assertIsNone(batch_no_details.details)

        batch_blank_details = BatchDetail.objects.create(
            user=self.user,
            batch_number="BATCH003",
            total_images_inspected=75,
            total_defected_images=7,
            total_non_defected_images=68,
            details=""  # Blank details
        )
        self.assertEqual(batch_blank_details.details, "")

    def test_max_length_batch_number(self):
        """Test that the batch_number field respects the max_length constraint."""
        long_batch_number = "B" * 500  # Exceeds the max_length of 50

        batch = BatchDetail(
            user=self.user,
            batch_number=long_batch_number,
            total_images_inspected=60,
            total_defected_images=6,
            total_non_defected_images=54
        )

        # The exception will be raised when validating, not creating the instance
        with self.assertRaises(Exception):
            batch.full_clean()  # This will trigger the validation, including max_length
            batch.save()        # Save after validation passes


    def test_status_choices(self):
        """Test that the status field can only take valid choices."""
        valid_batch = BatchDetail.objects.create(
            user=self.user,
            batch_number="BATCH004",
            total_images_inspected=80,
            total_defected_images=8,
            total_non_defected_images=72,
            status="completed"  # Valid choice
        )
        self.assertEqual(valid_batch.status, "completed")

        # Test invalid status (should raise ValidationError or similar)
        invalid_batch = BatchDetail.objects.create(
                user=self.user,
                batch_number="BATCH005",
                total_images_inspected=90,
                total_defected_images=9,
                total_non_defected_images=81,
                status="invalid_status"  # Invalid choice
            )
        with self.assertRaises(Exception):
            invalid_batch.full_clean()  # This will trigger the validation, including max_length
            invalid_batch.save()        # Save after validation passes