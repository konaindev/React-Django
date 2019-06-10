from remark.lib.views import APIView, LoginRequiredAPIView


class NewPropertyView(LoginRequiredAPIView):
    def post(self, request):
        return self.render_success({}, status=self.HTTP_200_OK)
