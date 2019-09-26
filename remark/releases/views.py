from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import ReleaseNote
from .serializers import ReleaseNoteSerializer


class ListReleaseNoteView(generics.ListAPIView):
    """
    GET releases/
    """
    permission_classes = [AllowAny]

    queryset = ReleaseNote.objects.all()
    serializer_class = ReleaseNoteSerializer


class ReleaseNoteDetailView(generics.RetrieveAPIView):
    """
    GET releases/:id/
    """
    permission_classes = [AllowAny]

    queryset = ReleaseNote.objects.all()
    serializer_class = ReleaseNoteSerializer

    def get(self, request, *args, **kwargs):
        try:
            release = self.queryset.get(pk=kwargs["pk"])
            return Response(ReleaseNoteSerializer(release).data)
        except ReleaseNote.DoesNotExist:
            return Response(
                data={
                    "message": "ReleaseNote with id: {} does not exist".format(kwargs["pk"])
                },
                status=status.HTTP_404_NOT_FOUND
            )
