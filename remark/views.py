from django.shortcuts import render  # noqa

# Create your views here.

from rest_framework.views import APIView, Response, status

class PingView(APIView):

    def get(self, request):
        data = {
            "success": True,
            "message": "Pong"
        }
        return Response(data, status=status.HTTP_200_OK)
