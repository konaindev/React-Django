from remark.lib.views import LoginRequiredAPIView


class NewPropertyView(LoginRequiredAPIView):
    def get(self, request):
        return self.render_success({}, status=self.HTTP_200_OK)
