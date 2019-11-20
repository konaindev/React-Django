from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from remark.lib.email import send_email
from remark.email_app.constants import SALES_EMAIL

from .forms import AddressForm, ProductInquiryForm


class ProductInquiryView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        property_form = ProductInquiryForm(request.POST, request.FILES)
        address_form = AddressForm(request.POST)
        property_valid = property_form.is_valid()
        address_valid = address_form.is_valid()
        if not (property_valid and address_valid):
            errors = property_form.errors.get_json_data()
            errors.update(address_form.errors.get_json_data())
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        product = property_form.instance
        product.user = request.user
        address = address_form.instance
        # Set default country to "US"
        if not address.country:
            address.country = address_form["country"].initial
        address.save()
        product.address = address
        product.save()

        attachments = None
        photo = property_form.cleaned_data["building_photo"]
        if photo:
            attachments = [
                {
                    'name': photo.name,
                    'content': photo.read(),
                    'type': photo.content_type,
                }
            ]
            product.building_photo = photo
            product.save()
        fields = property_form.visible_fields()
        fields.extend(address_form.visible_fields())

        send_email([SALES_EMAIL], 'email', {'fields': fields}, attachments)

        return Response({}, status=status.HTTP_200_OK)
