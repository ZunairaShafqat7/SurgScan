from django.urls import path
from . import api_views

urlpatterns = [
    path('login/', api_views.login_user, name='api_login_user'),
]
