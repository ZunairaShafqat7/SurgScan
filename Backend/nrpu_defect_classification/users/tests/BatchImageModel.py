from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from users.models import User, BatchDetail, BatchImage
import os

class BatchImageModelTest(TestCase):

    def setUp(self):
        # Create User and BatchDetail for foreign key relationships
        self.user = User.objects.create(
            email="batchimageuser@example.com",
            name="Batch Image User",
            number="9876543210",
            password="password123"
        )
        self.batch_detail = BatchDetail.objects.create(
            user=self.user,
            batch_number="BATCH003",
            total_images_inspected=75,
            total_defected_images=7,
            total_non_defected_images=68,
            details="Batch 003 details"
        )

        # Create a test image file
        self.image_file = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")

    def test_batch_image_creation(self):
        """Test that a BatchImage instance can be created successfully."""
        batch_image = BatchImage.objects.create(
            batch_detail=self.batch_detail,
            image=self.image_file
        )
        self.assertEqual(batch_image.batch_detail, self.batch_detail)
        self.assertTrue(batch_image.image.name.endswith("test_image.jpg"))
        self.assertIsNotNone(batch_image.uploaded_at)  # Auto-populated

    def test_batch_image_foreign_key(self):
        """Test the foreign key relationship between BatchImage and BatchDetail."""
        batch_image = BatchImage.objects.create(
            batch_detail=self.batch_detail,
            image=self.image_file
        )
        self.assertEqual(batch_image.batch_detail, self.batch_detail)

    def test_batch_image_str_method(self):
        """Test the string representation of the BatchImage model."""
        batch_image = BatchImage.objects.create(
            batch_detail=self.batch_detail,
            image=self.image_file
        )
        expected_str = f"Image for Batch {self.batch_detail.batch_number} uploaded at {batch_image.uploaded_at}"
        self.assertEqual(str(batch_image), expected_str)

    def tearDown(self):
        """Remove test image files after tests."""
        if os.path.exists(self.image_file.name):
            os.remove(self.image_file.name)

