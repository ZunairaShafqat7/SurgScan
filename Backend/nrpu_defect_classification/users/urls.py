from django.urls import path
from .views import api_updated_batch_details, api_update_batch_status ,api_get_dashboard_data, index, api_login_user, api_register_user, batch_details_view, api_get_user_profile,stats_view,get_all_stats, get_all_users,delete_user,admin_dashboard,get_user,api_update_user,api_inspect_image, add_batch_to_user
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', index, name='index'),
    path('api/login/', api_login_user, name='api_login_user'),
    path('api/register/', api_register_user, name='api_register_user'),
    path('api/profile/', api_get_user_profile, name='api_get_user_profile'),
    path('api/dashboard/', api_get_dashboard_data, name='api_get_dashboard_data'),#///////////////////////////////
    path('api/batch-details/', batch_details_view, name='batch_details_view'),
    path('api/stats/', stats_view, name='stats_view'),
    path('admini/stats/', get_all_stats, name='get_all_stats'),
    path('admini/get-users/', get_all_users, name='get_all_users'),
    path('admini/delete-user/<int:user_id>/', delete_user , name='delete-user'),
    path('admini/dashboard/<str:email>/', admin_dashboard , name='admin-dashboard'),
    path('api/get-user/<int:user_id>/', get_user, name='get_user'),
    path('api/update-user/<int:user_id>/', api_update_user, name='api_update_user'),
    path('api/update-batch-status/<str:batch_number>/', api_update_batch_status, name='api_update_batch_status'),
    path('api/get-updated-batch-details/', api_updated_batch_details, name='api_updated_batch_details'),
    path('api/inspect-image/', api_inspect_image, name='api_inspect_image'),
    # path('admini/add-batch/', add_batch_to_user, name='add_batch_to_user'),
    path('api/add-batch/', add_batch_to_user, name='add_batch_to_user')

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)