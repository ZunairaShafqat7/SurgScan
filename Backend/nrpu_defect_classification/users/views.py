from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
from django.views.decorators.csrf import csrf_exempt
from .models import User, BatchDetail
from django.contrib.auth.hashers import check_password,make_password
from django.conf import settings
from rest_framework import serializers
# from .serializers import UserSerializer
from .models import BatchDetail, AdminDetail, BatchImage
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from PIL import Image
import io
from datetime import datetime
from ultralytics import YOLO
import numpy as np
import cv2
import re
import torchvision.transforms as transforms
# Bandage_Scissor = YOLO("./models/Bandage Scissor.pt")
# Carver = YOLO("./models/Carver.pt")
# Dressing_Forcep = YOLO("./models/Dressing Forcep.pt")
# Ex_Probe = YOLO("./models/Ex-Probe.pt")
# Mcindoe_Forcep = YOLO("./models/Mcindoe Forcep.pt")
# Nail_Clipper = YOLO("./models/Nail Clipper.pt")
# Probe = YOLO("./models/Probe.pt")
# Scalpal = YOLO("./models/Scalpal.pt")
# Scissor = YOLO("./models/Scissor.pt")
# Teale_Vulsellum_Forceps = YOLO("./models/Teale Vulsellum Forceps.pt")
# Uterine_Curette = YOLO("./models/Uterine Curette.pt")
instruments = YOLO("./models/instruments.pt")
DEFECT_MODELS_PATHS = {
    "Bandage Scissor": "./models/Bandage Scissor.pt",
    "Carver": "./models/Carver.pt",
    "Dressing Forcep": "./models/Dressing Forcep.pt",
    "Ex-probe": "./models/Ex-Probe.pt",
    "Mcindoe Forcep": "./models/Mcindoe Forcep.pt",
    "Nail Clipper": "./models/Nail Clipper.pt",
    "Probe": "./models/Probe.pt",
    "Scalpal": "./models/Scalpal.pt",
    "Scissor": "./models/Scissor.pt",
    "Teale Vulsellum Forceps": "./models/Teale Vulsellum Forceps.pt",
    "Uterine Curette": "./models/Uterine Curette.pt"
}
# now what i want is that after login i want to be specific to that loged in user but i want to display all its batches and all the details instruments and defects
# instrument = YOLO("./models/INSTRUMENTS")

model = {"Bandage_Scissor", "Carver", "Dressing_Forcep", "Ex_Probe", "Mcindoe_Forcep", "Nail_Clipper", "Probe", "Scalpal", "Scissor", "Teale_Vulsellum_Forceps", "Uterine_Curette"}

# model = YOLO("C:\\Users\\Talha\\Documents\\UAV LAB\\NRPU\\Defect Detection\\Code\NRPU\Backend\nrpu_defect_classification\models\Carver.pt")
def get_admin_dashboard_details(user):
    # admin = AdminDetail.objects.filter(user_id=user.id).first()
    
    # # Count the total number of users registered
    # total_users = User.objects.filter(state='active').count()

    
    # # Count the total number of batches
    # total_batches = BatchDetail.objects.count()

    # # Count batches that are in progress
    # inprogress_batches = BatchDetail.objects.filter(status='inprogress').count()

    # # Count batches that are completed
    # completed_batches = BatchDetail.objects.filter(status='completed').count()

    # picture_url = f"{user.image.url}" if user.image else None

    # # Return all the data in a dictionary
    # return {
    #     "message": "Login successful!",
    #     "status": user.status,  # Return the user's status
    #     "name": user.name,  # Return the user's name
    #     "email": user.email,  # Return the user's email
    #     "designation": admin.designation if admin else None,  # Admin's designation if available
    #     "contact": user.number,  # User contact number
    #     "picture_url": picture_url,  # User's picture URL if available
    #     "total_users": total_users,  # Total number of users
    #     "total_batches": total_batches,  # Total number of batches
    #     "inprogress_batches": inprogress_batches,  # Batches in progress count
    #     "completed_batches": completed_batches,  # Completed batches count
    # }
                        picture_url = f"{user.image.url}" if user.image else None
                        created_at_date = user.created_at.strftime('%Y-%m-%d')
                        created_at_time = user.created_at.strftime('%H:%M:%S')
                        batch_details = BatchDetail.objects.all()
                        batch_data = []
                        for batch in batch_details:
                            instruments = Instrument.objects.filter(batch=batch)
                            instrument_data = []
                            
                            for instrument in instruments:
                                # Get all defects related to the instrument
                                defects = Defect.objects.filter(instrument=instrument)
                                
                                # Create a dictionary to store defect counts for each defect name
                                defect_count_map = {}
                                
                                for defect in defects:
                                    defect_name = defect.name
                                    if defect_name not in defect_count_map:
                                        defect_count_map[defect_name] = 0
                                    defect_count_map[defect_name] += 1
                                
                                # Create the defect data with defect count
                                defect_data = [{'defect_name': defect_name, 'count': count} 
                                            for defect_name, count in defect_count_map.items()]
                                
                                instrument_data.append({
                                    'instrument_name': instrument.name,
                                    'total_inspected': instrument.total_inspected,
                                    'total_defected': instrument.total_defected,
                                    'total_undefected': instrument.total_undefected,
                                    'defects': defect_data
                                })
                            
                            batch_data.append({
                                'batch_number': batch.batch_number,
                                'instrument': batch.instrument,
                                'total_images_inspected': batch.total_images_inspected,
                                'total_defected_images': batch.total_defected_images,
                                'total_non_defected_images': batch.total_non_defected_images,
                                'details': batch.details,
                                'status': batch.status,
                                'created_at': batch.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                                'instruments': instrument_data
                            })

                        # print(user.email)

                        return JsonResponse({
                            "message": "Login successful!",
                            "status": user.status,
                            "name": user.name,
                            "email": user.email,
                            "id": user.id,
                            "created_at_date": created_at_date,
                            "created_at_time": created_at_time,
                            "picture_url": picture_url,
                            "batch_details": batch_data
                        }, status=200)
def get_active_users():
    users = User.objects.filter(state='active')
    ids = []
    names = []
    batches = []
    status = []
    for user in users:
        ids.append(user.id)
        names.append(user.name)
        batches.append(user.batch_details.count())
        status.append(user.status)

    data = {
        "id": list(ids),
        "name": list(names),
        "total_batches": list(batches),
        "status": list(status)
    }
    return data
class UserBatchSerializer(serializers.ModelSerializer):
    total_batches = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'total_batches']

    def get_total_batches(self, obj):
        # Calculate total number of batches the user is working on
        return obj.batch_details.count()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'number', 'role', 'image', 'status', 'designation']
@csrf_exempt
def index(request):
    return render(request, 'index.html')

@api_view(['GET'])
def get_user(request, user_id):
        # print(user_id)
        # Fetch the user by ID
        user = get_object_or_404(User, id=user_id)
        data = { 
                                "email": user.email,  # Return the user's status
                                "name": user.name,  # Return the user's name
                                "number": user.number,  # Return the user's ID
                                "status": user.status,
        }
        if user.status == "admin":
            try:
                # Fetch the AdminDetail associated with this user
                admin_detail = AdminDetail.objects.get(user=user)
                # print(admin_detail)
                data['designation'] = admin_detail.designation  # Add the designation to the data
            except AdminDetail.DoesNotExist:
                return JsonResponse({"message": "Admin's Details Does not Exist!"})
        # print(user)
        # print(data,"\n")
        # Return the serialized data as a JSON response
        return Response(data, status=status.HTTP_200_OK)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
import json
from .models import User, BatchDetail, Instrument, Defect


@csrf_exempt
def api_login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            password = data.get('password')
            user = User.objects.filter(email=email).first()

            if user and user.state == 'active':
                # Check if the provided password is correct
                if check_password(password, user.password):
                    # if user.status == "user":
                        picture_url = f"{user.image.url}" if user.image else None
                        created_at_date = user.created_at.strftime('%Y-%m-%d')
                        created_at_time = user.created_at.strftime('%H:%M:%S')

                        if user.status == "user":
                            # Fetch all BatchDetails for the logged-in user
                            batch_details = BatchDetail.objects.filter(user=user)
                            print("User:" ,len(batch_details))
                            # print("User:",batch_details)
                        else:
                            batch_details = BatchDetail.objects.all()
                            # print("Admin:",batch_details)
                            print("Admin:" ,len(batch_details))

                        batch_data = []
                        for batch in batch_details:
                            instruments = Instrument.objects.filter(batch=batch)
                            instrument_data = []
                            
                            for instrument in instruments:
                                # Get all defects related to the instrument
                                defects = Defect.objects.filter(instrument=instrument)
                                
                                # Create a dictionary to store defect counts for each defect name
                                defect_count_map = {}
                                
                                for defect in defects:
                                    defect_name = defect.name
                                    if defect_name not in defect_count_map:
                                        defect_count_map[defect_name] = 0
                                    defect_count_map[defect_name] += 1
                                
                                # Create the defect data with defect count
                                defect_data = [{'defect_name': defect_name, 'count': count} 
                                            for defect_name, count in defect_count_map.items()]
                                
                                instrument_data.append({
                                    'instrument_name': instrument.name,
                                    'total_inspected': instrument.total_inspected,
                                    'total_defected': instrument.total_defected,
                                    'total_undefected': instrument.total_undefected,
                                    'defects': defect_data
                                })
                            
                            batch_data.append({
                                'batch_number': batch.batch_number,
                                'instrument': batch.instrument,
                                'total_images_inspected': batch.total_images_inspected,
                                'total_defected_images': batch.total_defected_images,
                                'total_non_defected_images': batch.total_non_defected_images,
                                'details': batch.details,
                                'status': batch.status,
                                'created_at': batch.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                                'instruments': instrument_data
                            })

                        # print(batch_data)

                        return JsonResponse({
                            "message": "Login successful!",
                            "status": user.status,
                            "name": user.name,
                            "email": user.email,
                            "id": user.id,
                            "number": user.number,
                            "created_at_date": created_at_date,
                            "created_at_time": created_at_time,
                            "picture_url": picture_url,
                            "batch_details": batch_data
                        }, status=200)
                    # else:
                    #     # Handle admin-specific logic
                    #     data = get_admin_dashboard_details(user)
                    #     return JsonResponse(data, status=200)
                else:
                    return JsonResponse({"message": "Invalid password!"}, status=400)
            else:
                return JsonResponse({"message": "Email not found!"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format"}, status=400)

    return JsonResponse({"message": "Method not allowed"}, status=405)


@csrf_exempt
def api_update_user(request, user_id):
    if request.method == 'POST':
        try:
            # Fetch the user from the database by ID
            user = get_object_or_404(User, id=user_id)

            # Get the updated data from the request
            email = request.POST.get('email', user.email)  # Use current email if not updated
            password = request.POST.get('password')
            name = request.POST.get('name', user.name)  # Use current name if not updated
            number = request.POST.get('number', user.number)  # Use current number if not updated
            role = request.POST.get('role' , user.status)  # Use current status if not updated
            status = request.POST.get('status')
            image = request.FILES.get('image')  # Optional image
            designation = request.POST.get('designation')  # Optional for admins
            print("Updated Info Recieved:", email, password, name, number, role, status)
            # Admin password check if updating role to 'admin'
            admin_password = request.POST.get('adminPassword')
            if status != "admin":
                return JsonResponse({"message": "You Don't have Admin Priviledges", "error_code": "INVALID_ADMIN_PRIVILEDGE"}, status=400)
            if admin_password != "admin123":
                return JsonResponse({"message": "Invalid admin password.", "error_code": "INVALID_ADMIN_PASSWORD"}, status=400)

            # If image is updated, save the new image
            if image:
                if user.image:
                    default_storage.delete(user.image.name)
                image_name = default_storage.save('images/' + image.name, ContentFile(image.read()))
                user.image = image_name  # Update image field


            # Update user details
            if password:  # If password is provided, hash and update it
                user.password = make_password(password)

            # Update the user fields
            user.email = email
            user.name = name
            user.number = number
            user.status = role 
            if role != 'admin':
                user.save()

            # If the user is an admin and designation is provided, update the designation
            if role == 'admin':
                admin_detail, created = AdminDetail.objects.get_or_create(user=user)
                admin_detail.designation = designation
                admin_detail.save()
                user.save()
            return JsonResponse({"message": "User updated successfully!"}, status=200)

        except Exception as e:
            print("Exception: " ,e)
            return JsonResponse({"message": "Update failed."}, status=500)

    return JsonResponse({"message": "Method not allowed"}, status=405)

@csrf_exempt
def api_register_user(request):
    if request.method == 'POST':
        try:
            withImage = 1
            if 'image' not in request.FILES:
                withImage = 0
                # return JsonResponse({"message": "Image file is required."}, status=400)

            email = request.POST.get('email')
            password = request.POST.get('password')
            name = request.POST.get('name')
            number = request.POST.get('number')
            admin_password = request.POST.get('adminPassword')
            print(">>>",admin_password)
            status=request.POST.get('role')
            if withImage:
                image = request.FILES['image']
            # Basic admin password check
            if admin_password != "admin123":
                return JsonResponse({"message": "Invalid admin password.", "error_code": "INVALID_ADMIN_PASSWORD"}, status=400)

            # Check if user already exists
            try:
                user = User.objects.get(email=email)
                if user and user.state == "active":###################################################
                    return JsonResponse({"message": "Email already registered.", "error_code": "Email_already_registered"}, status=400)
                if user and user.state == "inactive":
                    return JsonResponse({"message": "Email cannot be used.", "error_code": "INACTIVE_EMAIL"}, status=400)
                # if user and user.state == "inactive":
                #     return JsonResponse({"message": "Email cannot be used."}, status=400)
            except User.DoesNotExist:
                pass  # No user exists with this email,    
            if withImage:
                image_name = default_storage.save('images/' + image.name, ContentFile(image.read()))
            # Save the user
                user = User(
                    email=email,
                    name=name,
                    number=number,
                    password=make_password(password),  # Hash the password
                    image=image_name,
                    status=status
                )
            else:
                user = User(
                    email=email,
                    name=name,
                    number=number,
                    password=make_password(password),  # Hash the password
                    image=None,
                    status=status
                )
            if status != 'admin':
                user.save()

            if status == 'admin':
                designation = request.POST.get('designation')
    
                if not designation:
                    return JsonResponse({"message": "Designation Not Found."}, status=400)
                user.save()
                AdminDetail.objects.create(
                    user=user,
                    designation=designation  # Save the admin's designation
                )
            
            return JsonResponse({"message": "Registration successful!"}, status=200)

        except Exception as e:
            print(e)
            return JsonResponse({"message": "Registration failed."}, status=500)

    return JsonResponse({"message": "Method not allowed"}, status=405)


@api_view(['POST'])
def api_get_dashboard_data(request):
        if request.method == 'POST':
                # Get the name and ID from query parameters
                name = request.data.get('name')
                user_id = request.data.get('id')
                print("Got:" , name , user_id)
            
                user = User.objects.filter(id=user_id).first()

                if user and user.state == 'active':
                        picture_url = f"{user.image.url}" if user.image else None
                        created_at_date = user.created_at.strftime('%Y-%m-%d')
                        created_at_time = user.created_at.strftime('%H:%M:%S')

                        if user.status == "user":
                            # Fetch all BatchDetails for the logged-in user
                            batch_details = BatchDetail.objects.filter(user=user)
                            print("User:" ,len(batch_details))
                            # print("User:",batch_details)
                        else:
                            batch_details = BatchDetail.objects.all()
                            # print("Admin:",batch_details)
                            print("Admin:" ,len(batch_details))

                        batch_data = []
                        for batch in batch_details:
                            instruments = Instrument.objects.filter(batch=batch)
                            instrument_data = []
                            
                            for instrument in instruments:
                                # Get all defects related to the instrument
                                defects = Defect.objects.filter(instrument=instrument)
                                
                                # Create a dictionary to store defect counts for each defect name
                                defect_count_map = {}
                                
                                for defect in defects:
                                    defect_name = defect.name
                                    if defect_name not in defect_count_map:
                                        defect_count_map[defect_name] = 0
                                    defect_count_map[defect_name] += 1
                                
                                # Create the defect data with defect count
                                defect_data = [{'defect_name': defect_name, 'count': count} 
                                            for defect_name, count in defect_count_map.items()]
                                
                                instrument_data.append({
                                    'instrument_name': instrument.name,
                                    'total_inspected': instrument.total_inspected,
                                    'total_defected': instrument.total_defected,
                                    'total_undefected': instrument.total_undefected,
                                    'defects': defect_data
                                })
                            
                            batch_data.append({
                                'batch_number': batch.batch_number,
                                'instrument': batch.instrument,
                                'total_images_inspected': batch.total_images_inspected,
                                'total_defected_images': batch.total_defected_images,
                                'total_non_defected_images': batch.total_non_defected_images,
                                'details': batch.details,
                                'status': batch.status,
                                'created_at': batch.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                                'instruments': instrument_data
                            })

                        print(batch_data)

                        return JsonResponse({
                            "message": "Login successful!",
                            "status": user.status,
                            "name": user.name,
                            "email": user.email,
                            "id": user.id,
                            "number": user.number,
                            "created_at_date": created_at_date,
                            "created_at_time": created_at_time,
                            "picture_url": picture_url,
                            "batch_details": batch_data
                        }, status=200)
                else:
                    return JsonResponse({'error': 'User not found or inactive'}, status=404)
        else:
            return JsonResponse({'error': 'Method not allowed'}, status=404)
@api_view(['POST'])
def api_get_user_profile(request):
    if request.method == 'POST':
        try:
            # Get the name and ID from query parameters
            name = request.data.get('name')
            user_id = request.data.get('id')
            # print(name,user_id)

            # Find the user by ID and name
            user = User.objects.filter(id=user_id, name=name).first()
            # print(user.name)
            if user:
                # Fetch the user's batch details
                picture_url = f"{user.image.url}" if user.image else None
                created_at_date = user.created_at.strftime('%Y-%m-%d')
                created_at_time = user.created_at.strftime('%H:%M:%S')
                batch_details = BatchDetail.objects.filter(user=user).values(
                    'batch_number', 'total_images_inspected', 'total_defected_images', 'total_non_defected_images', 'details'
                )
                # print(batch_details)

                return JsonResponse({
                    "message": "Profile data retrieved successfully!",
                    "status": user.status,
                    "name": user.name,
                    "id": user.id,
                    "created_at_date": created_at_date,
                    "created_at_time": created_at_time,
                    "picture_url": picture_url,
                    "batch_details": list(batch_details)
                }, status=200)
            else:
                return JsonResponse({"message": "User not found!"}, status=404)

        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=400)

    return JsonResponse({"message": "Method not allowed"}, status=405)


@api_view(['POST'])
def stats_view(request):
    if request.method == 'POST':
        try:
            # Get the name and ID from query parameters
            name = request.data.get('name')
            user_id = request.data.get('id')
            if not (user_id and name):
                return JsonResponse({"message":"Perimeters missing!"})

            # Find the user by ID and name
            batches = BatchDetail.objects.filter(user_id=user_id)
            response_data = [
            {
                "batch_no": batch.batch_number,
                "user_id": user_id,
                "name": name,
                "total_images": batch.total_images_inspected,
                "defected": batch.total_defected_images,
                "undefected": batch.total_non_defected_images,
            }
            for batch in batches
            ]
            if response_data:
                return JsonResponse({"message": "Here is the data","batches": response_data}, safe=False)
                # return JsonResponse( { "message" : "Here is data"} , data = response_data, safe=False)
            else:
                return JsonResponse({"message": "No Details Found!"}, status=404)

        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=400)

    return JsonResponse({"message": "Method not allowed"}, status=405)
@csrf_exempt
def batch_details_view(request):
    if request.method == 'POST':
        user_id = request.POST.get('id')
        user_name = request.POST.get('name')
        batch_no = request.POST.get('batch')
        details = request.POST.get('details')
        if (not user_id) or (not batch_no):
            return JsonResponse({"message":"Perimeters are Missing!!!"})
        # print(user_id,user_name)
        try:
            # Fetch the user based on the ID
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"message":"User Does not exist!"},status = 404)
        # Check if the batch number already exists for this user
        batch = BatchDetail.objects.filter(user=user, batch_number=batch_no).first()

        if not batch:
            # Create a new batch entry if it doesn't exist
            # batch = BatchDetail(
            #     user=user,
            #     batch_number=batch_no,
            #     total_images_inspected=0,  # Initialize these values as needed
            #     total_defected_images=0,
            #     total_non_defected_images=0,
            #     details=details  # Assuming you've added the 'details' field
            # )
            # batch.save()
            # message = "New batch created!"
             return JsonResponse({"message" : "Batch does not exist please consult admin!"})
        # else:
        #     return JsonResponse({"message" : "User is already working on this batch"})

        return JsonResponse({"message": "Welcome, Please continue inspection", "batch_id": batch_no, "user_id": user_id, "user_name": user_name})

    return JsonResponse({"message": "Invalid request method."}, status=400)


def format_name(name):
    """Helper function to format the user's name to be included in the batch number."""
    return re.sub(r'[^a-zA-Z0-9]', '', name)  # Remove any non-alphanumeric characters
@csrf_exempt
def add_batch_to_user(request):
    # Assuming the request is a POST and contains the 'email'
    if request.method == 'POST':
        email = request.POST.get('email')
        instrument = request.POST.get('instrument')
        details = request.POST.get('details')
        print(email , instrument, details)
        # Check if the email is provided
        if not email:
            return JsonResponse({'error': 'Email is required.'}, status=400)

        # Get the user with the given email
        user = User.objects.filter(email=email).first()
        # print(user)
        if not user:
            return JsonResponse({"message":"User not found!"}, status=400)
        # Format the user's name for the batch number
        formatted_name = format_name(user.name)[:3].upper()

        # Generate a unique batch number using user id, formatted name, and timestamp
        timestamp = datetime.now().strftime("%y_%m_%d-%H_%M_%S")
        batch_number = f'B-{user.id}-{formatted_name}-{timestamp}'

        # formatted_name = format_name(user.name)[:3].upper()  # Use only first 3 letters
        # timestamp = datetime.now().strftime("%y%m%d%H%M")    # YYMMDDHHMM for brevity
        # batch_number = f'B-{user.id}-{formatted_name}-{timestamp}'

        # Create a new batch for the user
        new_batch = BatchDetail.objects.create(
            user=user,
            batch_number=batch_number,
            total_images_inspected=0,  # Set initial values
            total_defected_images=0,
            total_non_defected_images=0,
            details=details,
            status='inprogress',
            instrument=instrument
        )
        # Step 2: Create the instrument entry for the batch
        Instrument.objects.create(
            batch_id=new_batch.id,
            name=instrument,
            total_defected=0,
            total_undefected=0,
            total_inspected=0
        )

        return JsonResponse({
            'message': f'Batch {batch_number} successfully created and assigned to user {user.email}.',
            'batch_number': batch_number
        }, status=201)

    return JsonResponse({'error': 'Invalid request method.'}, status=400)

@csrf_exempt
def get_all_stats(request):
    if request.method == 'GET':
        # Fetch all users and batch details
        # users = User.objects.all().values('id', 'name', 'email', 'number')  # Adjust fields accordingly
        batches = BatchDetail.objects.all().values('batch_number', 'total_images_inspected', 'total_defected_images', 'total_non_defected_images', 'details')  # Adjust fields accordingly
        if not batches:
            # Instead of throwing a 400 error, return an empty batch list with a message
            return JsonResponse({
                "message": "No batches exist",
                "batches": []
            }, status=200)
        data = {
            # 'users': list(users),
            'batches': list(batches)
        }
        # print(data)

        return JsonResponse(data)
    return JsonResponse({'error': 'Invalid request method.'}, status=400)


@csrf_exempt
def get_all_users(request):
        if request.method == 'GET':
            data = get_active_users()


        #      "id": list(ids),
        # "name": list(names),
        # "total_batches": list(batches),
        # "status": list(status)


            if not data["id"]:
                data = {
                    "id": [],
                    "name": [],
                    "total_batches": [],
                    "status": []
                }
                # Instead of throwing a 400 error, return an empty batch list with a message
                return JsonResponse({
                    "message": "No users exist",
                    "data": data
                }, status=200)
            # print(data)
            return JsonResponse(data, safe=False)
        return JsonResponse({'error': 'Invalid request method.'}, status=400)

@api_view(['POST'])
def api_updated_batch_details(request):
    if request.method == 'POST':
        try:
            # Get the name and ID from query parameters
            status = request.data.get('status')
            user_id = request.data.get('userId')
            user = User.objects.filter(id=user_id).first()
            if status == "user":
                            batch_details = BatchDetail.objects.filter(user=user)
                            print("User:" ,len(batch_details))
            else:
                            batch_details = BatchDetail.objects.all()
                            # print("Admin:",batch_details)
                            print("Admin:" ,len(batch_details))
            inprogress_count = batch_details.filter(status="inprogress").count()
            completed_count = batch_details.filter(status="complete").count()
            print("inprogress_count:", inprogress_count)
            print("completed_count:", completed_count)
            return JsonResponse({
                    "message": "Updated Batch Counts!",
                    "inprogress_count": inprogress_count,
                    "completed_count": completed_count
                }, status=200)
        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=400)
        
from urllib.parse import unquote
@csrf_exempt
def api_update_batch_status(request, batch_number):
    if request.method == "PATCH":
        try:
            data = json.loads(request.body)
            new_status = data.get("status")
            batch_number = unquote(batch_number)
            batch = BatchDetail.objects.get(batch_number=batch_number)
            batch.status = new_status
            batch.save()

            return JsonResponse({
                "message": "Batch status updated successfully",
                "batch_number": batch_number,
                "new_status": new_status,
            }, status=200)

        except BatchDetail.DoesNotExist:
            return JsonResponse({"error": "Batch not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)




@csrf_exempt
def delete_user(request, user_id):
    if request.method == 'DELETE':
        try:
            user = User.objects.get(id=user_id)
            if user.state != 'inactive':
                user.state = 'inactive'  # Set status to inactive
                deleted_user = user.name 
                user.save()  # Save changes to the database

                # Fetch the updated list of active users
                data = get_active_users()

                if not data["id"]:
                    data = {
                        "id": [],
                        "name": [],
                        "total_batches": [],
                        "status": []
                    }
                    # Instead of throwing a 400 error, return an empty batch list with a message
                    return JsonResponse({
                        "message": "No users exist",
                        "updated_data": data
                    }, status=200)


                return JsonResponse({
                    "message": "User: ---" + str(deleted_user) + "--- DELETED sucessfully!",
                    "updated_data": data
                }, status=200)
            else:
                return JsonResponse({"message": "User is already DELETED"}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    return JsonResponse({'error': 'Invalid request method.'}, status=400)

@csrf_exempt
def admin_dashboard(request, email):
    if request.method == 'POST':
        try:
            # print(email)
            user = User.objects.get(email=email)
            if user.status != "admin":
                return JsonResponse({"message": str(email) +  " is not an Admin!"}, status=404)
            if user.state == "inactive":
                return JsonResponse({"message": str(email) +  " has been deleted!"}, status=404)
            data = get_admin_dashboard_details(user)
            return JsonResponse(data, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error":str(email) + " does not exists!"}, status=404)
    return JsonResponse({'error': 'Invalid request method:' + str(request.method)}, status=400)

def unsharp_mask(image, kernel_size=(0, 0), sigma=3.0, strength=1.5):
    image_cv = image
    print("In unsharp_mask")

    blurred = cv2.GaussianBlur(image_cv, (0, 0), 3)
    sharpened = cv2.addWeighted(image_cv, 2, blurred, -1, 0)
    


    # sharpened = Image.fromarray(cv2.cvtColor(sharpened, cv2.COLOR_BGR2RGB))  # Convert to RGB
    # transform = transforms.Compose([
    #     transforms.Lambda(lambda img: transforms.functional.adjust_brightness(img, 1.15)), 
    #     transforms.Lambda(lambda img: transforms.functional.adjust_contrast(img, 1.2)), 
    #     # transforms.Lambda(lambda img: transforms.functional.adjust_saturation(img, 1.20)), 
    #     # transforms.GaussianBlur(kernel_size=3, sigma=1.0),  # Add fixed blur with sigma=1.0
    #     # transforms.Lambda(lambda img: transforms.functional.adjust_gamma(img, gamma=1.2))  # Gamma correction to make it slightly darker
    # ])
    # # Apply the transformations
    # sharpened = transform(sharpened)
    # sharpened = np.array(sharpened)
    # sharpened = cv2.cvtColor(sharpened, cv2.COLOR_RGB2BGR)  # Convert back to BGR for OpenCV


    target_size = (1024, 1024)
    if sharpened.shape[0] != target_size[0] or sharpened.shape[1] != target_size[1]:
        # print(f"Resizing image from {sharpened.shape[:2]} to {target_size}")
        sharpened = cv2.resize(sharpened, target_size)
    return Image.fromarray(sharpened)
    # return sharpened
def resize_with_aspect_ratio(image, target_size,pixel):
    print("In resize_with_aspect_ratio")
    h, w = image.shape[:2]
    target_w, target_h = target_size
    # Calculate the scaling factor to fit the image within target size while maintaining aspect ratio
    scale = min(target_w / w, target_h / h)
    # Calculate new dimensions that maintain aspect ratio
    new_w = int(w * scale)
    new_h = int(h * scale)
    # Resize the image
    resized_image = cv2.resize(image, (new_w, new_h))

    # Create a new image of the target size and fill it with a black background
    output_image = cv2.copyMakeBorder(
        resized_image,
        top=(target_h - new_h) // 2, bottom=(target_h - new_h + 1) // 2,
        left=(target_w - new_w) // 2, right=(target_w - new_w + 1) // 2,
        borderType=cv2.BORDER_CONSTANT,
        value=[int(pixel[0]), int(pixel[1]), int(pixel[2])]  # black padding, change to [255, 255, 255] for white padding
    )

    # blurred = cv2.GaussianBlur(output_image, (0, 0), 3)
    # sharpened = cv2.addWeighted(output_image, 2, blurred, -1, 0)
    # return Image.fromarray(output_image)

    print("Out resize_with_aspect_ratio")
    return output_image
def extract_cropped(image):
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # Apply Gaussian Blur
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)

            # Apply Canny edge detection
            edges = cv2.Canny(blurred, 50, 150)
            # Apply Otsu's thresholding
            # _, thresholded = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

            # # Apply Adaptive Thresholding
            # adaptive_thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

            # Apply Morphological Transformations
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
            # Dilation to emphasize edges
            dilated = cv2.dilate(edges, kernel, iterations=2)
            # Erosion to clean up small noise
            eroded = cv2.erode(dilated, kernel, iterations=1)
            contours, _ = cv2.findContours(eroded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            cropped_image = None
            for i,contour in enumerate(contours):
                # Get bounding box coordinates
                x, y, w, h = cv2.boundingRect(contour)
                print("w*h: ", w, ":" , h , "Area: ", w*h , "Aspect ratio: ",w/h)
                if not(w*h<1840000 and w*h>400000):
                    continue
                print("w@*h: ", w, ":" , h , "Area: ", w*h , "Aspect ratio: ",w/h)
                print(i,image.shape)
                # Draw rectangle around contour
                # cropped_image = cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
                cropped_image = image[y:y+h,x:x+w]
                h,w,c = image.shape
                if x+w+11 > w:
                    patch = image[int((y+h)/2):int(((y+h)/2))+2,x-11:x-1]
                else:
                    patch = image[int((y+h)/2):int(((y+h)/2))+2,x+w+1:x+w+11]
                average_color = np.mean(patch, axis=(0, 1))
                average_color = tuple(map(int, average_color))
                cropped_image = resize_with_aspect_ratio(cropped_image,(1024,1024),average_color)
                # image_io = io.BytesIO()
                # cropped_image.save(image_io, format='JPEG')  # Save the PIL image to BytesIO
                # image_content = ContentFile(image_io.getvalue())  # Create a ContentFile

                # # Save to storage
                # default_storage.save('images/cropped.jpg', image_content)
                break
            return cropped_image
from io import BytesIO
@csrf_exempt
def api_inspect_image(request):
    if request.method == 'POST':
        batch = request.POST.get('batch')
        user_id = request.POST.get('id')
        # Get the image file from the request
        image = request.FILES.get('image')
        # Open the image with Pillow
        try:
            # if image:
                # default_storage.save('images/raw.jpg', ContentFile(image.read()))
                image = Image.open(image)
        except Exception as e:
            return JsonResponse({'error': f'Failed to open image: {str(e)}'}, status=500)

        if not image or not batch or not user_id:
            return JsonResponse({'error': 'Missing perimeters'}, status=400)

        # Validate the batch and user information
        try:
            batch_detail = BatchDetail.objects.get(batch_number=batch, user_id=user_id)
        except BatchDetail.DoesNotExist:
            return JsonResponse({'error': 'Batch not found(userId or batchNo incorrect)'}, status=404)
        
        try:
            # If the image is in 'RGBA' mode (which has an alpha channel), convert it to 'RGB'
            if image.mode == 'RGBA':
                image = image.convert('RGB')
                image.save(r"first.jpg",format="JPEG")
                # return JsonResponse({"message":"RGBA converted to RGB"})
                # image_io = BytesIO()
                # image.save(image_io, format='JPEG')  # Save as JPEG in the BytesIO object

                # # Use default_storage to save the file
                # default_storage.save('images/raw.jpg', ContentFile(image_io.getvalue()))

        except Exception as e:
            return JsonResponse({'error': f'Failed to open image: {str(e)}'}, status=500)
        # image = None
        try:
            # image = np.array(image)
            cropped_image=None
            image = np.array(image)
            # cropped_image = extract_cropped(image)
            # cropped_image =None
            print("Starting Unsharp Masking")
            if cropped_image is not None:
                image = unsharp_mask(cropped_image)
                # cv2.imwrite("check.jpg",image)
            else:

                image = unsharp_mask(image)
                # return JsonResponse({"message":"Preprocessing/Unsharp Masking Successfull"})
                # image = resize_with_aspect_ratio(image,(1024,1024),[0,0,0])

        except Exception as e:
            return JsonResponse({'error': f'Preprocessing/Unsharp masking failed: {str(e)}'}, status=400)
        
        # image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert from BGR to RGB
        # image = Image.fromarray(image_rgb)
        # Convert the image to a file-like object (BytesIO)
        image_bytes = io.BytesIO()
        image.save(image_bytes, format='JPEG')  # Save as PNG or any other format you prefer
        image_bytes.seek(0)  # Reset pointer to the beginning of the file
        

        # Create a file name for the image
        image_name = f"{batch}_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        print(image_name)
        # Save the image as a ContentFile
        image_file = ContentFile(image_bytes.read(), name=image_name)
        # print(image_file)

        # Save the image to the BatchImage model
        # batch_image = BatchImage.objects.create(batch_detail=batch_detail, image=image_file)
        # batch_image.save()
        # BatchImage.objects.all().delete()



        try:
            image = np.array(image)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            cv2.imwrite("last.jpg",image)
            prediction = instruments(image)
            # print(prediction)
            # Extract the class label and confidence score from the prediction
            predicted_class = prediction[0].names[prediction[0].probs.top1]  # Get the predicted class
            confidence = round(prediction[0].probs.top1conf.item()*100)  # Get the confidence score
            print(">>",predicted_class,type(predicted_class))
            print(">",confidence,type(confidence))
            # if(predicted_class == "Bandage Scissor"):
            #     image = extract_cropped(image)
            if predicted_class == "miscellaneous" or confidence<70:# and confidence >= 90:
                instrument = "Unidentified"
                defect = "Unidentified"
            
            else:
                if predicted_class == "miscellaneous" and confidence < 70:
                    predicted_class = prediction[0].names[prediction[0].probs.top5[1]]  # Second predicted class
                    confidence = round(float(prediction[0].probs.top5conf[1])*100)  # Confidence of the second class
                    # print("con>>>",confidence)
                batch_detail = BatchDetail.objects.get(batch_number=batch)
                batch_instrument = batch_detail.instrument
                instrument = predicted_class
                if instrument != batch_instrument:
                    print("Instruments Mismatched!!!")
                    message = "Only " + str(batch_instrument) + " can be Inspected!"
                    date = datetime.now().strftime('%Y-%m-%d')
                    time = datetime.now().strftime('%H:%M:%S')
                    return JsonResponse({
                        'message': message,
                        'defect': None,
                        'confidence': None,
                        'instrument': 'Wrong Instrument',
                        'time': time,
                        'date': date
                    }, status=200)
                try:
                    # image = np.array(image)
                    print(DEFECT_MODELS_PATHS[predicted_class])
                    model_defect = YOLO(DEFECT_MODELS_PATHS[predicted_class])
                    prediction = model_defect(image)
                    # print(">>>",prediction,"\n")
                    # Extract the class label and confidence score from the prediction
                    predicted_class = prediction[0].names[prediction[0].probs.top1]  # Get the predicted class
                    defect  = predicted_class + "/" + prediction[0].names[prediction[0].probs.top5[1]]
                    confidence = round(prediction[0].probs.top1conf.item()*100)  # Get the confidence score
                    print(">>",predicted_class,type(predicted_class))
                    print(">",confidence)

                    batch_detail.total_images_inspected += 1
                    if defect == "Undefected":
                        batch_detail.total_non_defected_images += 1
                    else:
                        batch_detail.total_defected_images += 1
                        instrument_obj, created = Instrument.objects.get_or_create(
                        batch=batch_detail,
                        name=batch_detail.instrument)

                        # Update counts
                        instrument_obj.total_inspected += 1
                        instrument_obj.total_defected += 1
                        instrument_obj.save()

                        # Add defect record
                        Defect.objects.create(
                            instrument=instrument_obj,
                            name=predicted_class,
                            description=None 
                        )

                except Exception as e:
                    return JsonResponse({'error': f'YOLOv8 defect prediction failed: {str(e)}'}, status=500)


                batch_image = BatchImage.objects.create(batch_detail=batch_detail, image=image_file)
                batch_image.save()
                batch_detail.save()
                # BatchImage.objects.all().delete()
                # BatchDetail.objects.all().delete()

        except Exception as e:
            return JsonResponse({'error': f'YOLOv8 instrument prediction failed: {str(e)}'}, status=500)
        


        # Respond with success and include the URL to access the image
        date = datetime.now().strftime('%Y-%m-%d')
        time = datetime.now().strftime('%H:%M:%S')
        # print(time, date)
        return JsonResponse({
            'message': 'Instrument Inspected successfully',
            # 'file_path': batch_image.image.url,  # Accessible URL of the image
            'defect': defect,
            'confidence': confidence,
            'instrument': instrument,
            'time': time,
            'date': date
        }, status=200)

    return JsonResponse({'error': 'Invalid request method:' + str(request.method)}, status=400)


@api_view(['POST'])
def api_edit(request):
     if request.method == 'POST':
        try:
            # Get the name and ID from query parameters
            name = request.data.get('name')
            user_id = request.data.get('id')
            email = request.data.get('email')
            number = request.data.get('number')
            if not (name and user_id and email and number):
                 return JsonResponse({'error': 'Details Missing'}, status=400)

            # Find the user by ID and name
            user = User.objects.filter(id=user_id).first()
            
            if user:
                 user.name = name
                 user.email = email
                 user.number = number
                 user.save()
                 return JsonResponse({'message': 'User with ID:{user_id} Updated Sucessfully!'}, status=200)
            else:
                 return JsonResponse({'error': 'User with ID:{user_id} Not Found'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'User Updation failed: {str(e)}'}, status=500)
        