from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if email == "admin@gmail.com" and password == "admin123":
        return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)

    data_dict = {}
    with open('./static/users.txt', 'r') as file:
        for line in file:
            values = line.strip().split(",")
            email_from_file = values[1]
            password_from_file = values[2]
            name = values[3]
            phone = values[4]
            data_dict[email_from_file] = {'password': password_from_file, 'name': name, 'phone': phone}

    if email in data_dict and password == data_dict[email]['password']:
        return Response({"message": "Login successful!", "name": data_dict[email]['name'], "id": data_dict[email]['id']}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)
