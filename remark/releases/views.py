from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import ReleaseNote
from .serializers import ReleaseNoteSerializer


class ReleaseNoteViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):

    permission_classes = [AllowAny]

    queryset = ReleaseNote.objects.all()
    serializer_class = ReleaseNoteSerializer
